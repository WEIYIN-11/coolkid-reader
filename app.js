/* =========================================
   coolkid 的閱讀器（多本書版）
   ========================================= */
const STORAGE_KEY = 'tibetan-reader-state';
const FONT_MIN = -2;
const FONT_MAX = 4;

const state = {
  manifest: null,
  currentBookIdx: 0,
  currentChapterIdx: 0,
  fontStep: 0,
  theme: 'dark',
};

/* ---------- bootstrap ---------- */
async function init() {
  loadState();
  applyFont();
  applyTheme(state.theme);

  try {
    const res = await fetch('chapters/manifest.json', { cache: 'no-cache' });
    if (!res.ok) throw new Error('HTTP ' + res.status);
    state.manifest = await res.json();
  } catch (e) {
    showError('章節清單載入失敗：' + e.message + '。請確認是透過 HTTP server 開啟（不能直接雙擊 index.html）。');
    return;
  }

  // schema migration: 舊版只有 chapters，沒有 books
  if (!state.manifest.books && state.manifest.chapters) {
    state.manifest.books = [{
      id: 'main',
      title: state.manifest.title,
      subtitle: state.manifest.subtitle || '',
      status: '',
      chapters: state.manifest.chapters,
    }];
  }

  document.title = state.manifest.title;
  renderChapterList();

  const saved = readSaved();
  const startBookIdx = clampIdx(saved.lastBook ?? 0, state.manifest.books.length);
  const startChapterIdx = clampIdx(
    saved.lastChapterByBook?.[state.manifest.books[startBookIdx].id] ?? 0,
    state.manifest.books[startBookIdx].chapters.length
  );
  state.currentBookIdx = startBookIdx;
  state.currentChapterIdx = startChapterIdx;
  await loadChapter(startBookIdx, startChapterIdx);

  bindUI();
}

/* ---------- state helpers ---------- */
function readSaved() {
  try { return JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}'); }
  catch { return {}; }
}
function saveState(patch) {
  const saved = readSaved();
  Object.assign(saved, patch);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(saved));
}
function loadState() {
  const saved = readSaved();
  state.fontStep = clamp(saved.fontStep ?? 0, FONT_MIN, FONT_MAX);
  state.theme = saved.theme === 'light' ? 'light' : 'dark';
}
function clamp(v, min, max) { return Math.max(min, Math.min(max, v)); }
function clampIdx(v, length) {
  const n = Number(v) || 0;
  return Math.max(0, Math.min(length - 1, n));
}

/* ---------- chapter list ---------- */
function renderChapterList() {
  const ol = document.getElementById('chaptersOl');
  ol.innerHTML = '';

  state.manifest.books.forEach((book, bookIdx) => {
    // 書名 group heading
    const group = document.createElement('li');
    group.className = 'book-group';
    const header = document.createElement('div');
    header.className = 'book-group-header';
    const titleEl = document.createElement('p');
    titleEl.className = 'book-group-title';
    titleEl.textContent = book.title;
    const subEl = document.createElement('p');
    subEl.className = 'book-group-subtitle';
    const statusBadge = book.status ? ` · ${book.status}` : '';
    subEl.textContent = (book.subtitle || '') + statusBadge;
    header.appendChild(titleEl);
    header.appendChild(subEl);
    group.appendChild(header);

    // chapter list under this book
    const ul = document.createElement('ol');
    ul.className = 'book-group-items';
    book.chapters.forEach((ch, chapterIdx) => {
      const li = document.createElement('li');
      const btn = document.createElement('button');
      btn.type = 'button';
      btn.textContent = ch.title;
      btn.dataset.bookIdx = String(bookIdx);
      btn.dataset.chapterIdx = String(chapterIdx);
      btn.addEventListener('click', () => {
        loadChapter(bookIdx, chapterIdx);
        closeChapterList();
      });
      li.appendChild(btn);
      ul.appendChild(li);
    });
    group.appendChild(ul);
    ol.appendChild(group);
  });
}

/* ---------- chapter loading ---------- */
async function loadChapter(bookIdx, chapterIdx) {
  if (!state.manifest) return;
  if (bookIdx < 0 || bookIdx >= state.manifest.books.length) return;
  const book = state.manifest.books[bookIdx];
  if (chapterIdx < 0 || chapterIdx >= book.chapters.length) return;

  state.currentBookIdx = bookIdx;
  state.currentChapterIdx = chapterIdx;
  const ch = book.chapters[chapterIdx];

  const content = document.getElementById('content');
  content.innerHTML = '<div class="loading" role="status" aria-label="載入中"><span class="loading-sigil" aria-hidden="true">❖</span></div>';

  let md;
  try {
    const res = await fetch(`chapters/${book.id}/${ch.file}`, { cache: 'no-cache' });
    if (!res.ok) throw new Error('HTTP ' + res.status);
    md = await res.text();
  } catch (e) {
    showError('章節內容載入失敗：' + e.message);
    return;
  }

  if (window.marked) {
    marked.setOptions({ gfm: true, breaks: false });
    content.innerHTML = marked.parse(md);
  } else {
    const safe = md.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
    content.innerHTML = '<pre>' + safe + '</pre>';
  }

  // re-trigger entry animation
  content.style.animation = 'none';
  void content.offsetWidth;
  content.style.animation = '';

  // restore scroll for (book, chapter)
  const saved = readSaved();
  const scrolls = saved.scrolls || {};
  const key = `${book.id}/${ch.id}`;
  window.scrollTo(0, scrolls[key] || 0);

  // update brand to current book
  updateBrand(book);

  // update list highlight
  document.querySelectorAll('#chaptersOl button').forEach((b) => {
    const active = Number(b.dataset.bookIdx) === bookIdx && Number(b.dataset.chapterIdx) === chapterIdx;
    b.classList.toggle('active', active);
  });

  // nav buttons (跨書翻頁)
  const prevExists = !(bookIdx === 0 && chapterIdx === 0);
  const isLastChapter = chapterIdx === book.chapters.length - 1;
  const isLastBook = bookIdx === state.manifest.books.length - 1;
  const nextExists = !(isLastChapter && isLastBook);
  document.getElementById('prevChap').disabled = !prevExists;
  document.getElementById('nextChap').disabled = !nextExists;

  // progress: current chapter / total in current book
  document.getElementById('navProgress').textContent =
    `${book.id.toUpperCase()} ` +
    String(chapterIdx + 1).padStart(2, '0') + ' / ' + String(book.chapters.length).padStart(2, '0');

  // persist last position
  const lastChapterByBook = saved.lastChapterByBook || {};
  lastChapterByBook[book.id] = chapterIdx;
  saveState({ lastBook: bookIdx, lastChapterByBook });
}

function updateBrand(book) {
  const titleEl = document.querySelector('.brand-title');
  const subEl = document.querySelector('.brand-subtitle');
  if (titleEl) titleEl.textContent = book.title;
  if (subEl) subEl.textContent = book.subtitle || '';
}

function gotoPrev() {
  const bookIdx = state.currentBookIdx;
  const chapterIdx = state.currentChapterIdx;
  if (chapterIdx > 0) {
    loadChapter(bookIdx, chapterIdx - 1);
  } else if (bookIdx > 0) {
    // 跳到上一本書最後一章
    const prevBook = state.manifest.books[bookIdx - 1];
    loadChapter(bookIdx - 1, prevBook.chapters.length - 1);
  }
}
function gotoNext() {
  const bookIdx = state.currentBookIdx;
  const chapterIdx = state.currentChapterIdx;
  const book = state.manifest.books[bookIdx];
  if (chapterIdx < book.chapters.length - 1) {
    loadChapter(bookIdx, chapterIdx + 1);
  } else if (bookIdx < state.manifest.books.length - 1) {
    // 跳到下一本書第一章
    loadChapter(bookIdx + 1, 0);
  }
}

function showError(msg) {
  const content = document.getElementById('content');
  content.innerHTML = '<p style="color:var(--accent);text-align:center;padding:60px 0;text-indent:0;">' + msg + '</p>';
}

/* ---------- settings ---------- */
function applyFont() {
  const base = 18;
  const size = base + state.fontStep * 2;
  const sizeStr = size + 'px';

  // 四重保險：CSS variable + body inline + content inline + CSS !important
  document.documentElement.style.setProperty('--font-size', sizeStr);
  document.body.style.setProperty('font-size', sizeStr, 'important');
  const content = document.getElementById('content');
  if (content) content.style.setProperty('font-size', sizeStr, 'important');

  // Footer 顯示當前字級
  const dbg = document.getElementById('fontDebug');
  if (dbg) dbg.textContent = `字級 ${sizeStr}`;
}

function applyTheme(theme) {
  state.theme = theme;
  document.documentElement.dataset.theme = theme;
  const meta = document.querySelector('meta[name="theme-color"]');
  if (meta) meta.setAttribute('content', theme === 'dark' ? '#0a0e1a' : '#f4ede0');
  const toggle = document.getElementById('themeToggle');
  if (toggle && toggle.firstElementChild) {
    toggle.firstElementChild.textContent = theme === 'dark' ? '☾' : '☀';
  }
}

/* ---------- chapter list panel ---------- */
function openChapterList() {
  const list = document.getElementById('chapterList');
  const overlay = document.getElementById('overlay');
  const btn = document.getElementById('menuBtn');
  list.setAttribute('aria-hidden', 'false');
  overlay.setAttribute('aria-hidden', 'false');
  btn.setAttribute('aria-expanded', 'true');

  // 自動捲到目前章節
  setTimeout(() => {
    const active = list.querySelector('button.active');
    if (active) active.scrollIntoView({ block: 'center', behavior: 'auto' });
  }, 50);
}
function closeChapterList() {
  const list = document.getElementById('chapterList');
  const overlay = document.getElementById('overlay');
  const btn = document.getElementById('menuBtn');
  list.setAttribute('aria-hidden', 'true');
  overlay.setAttribute('aria-hidden', 'true');
  btn.setAttribute('aria-expanded', 'false');
}

/* ---------- bind UI ---------- */
function bindUI() {
  document.getElementById('menuBtn').addEventListener('click', () => {
    const list = document.getElementById('chapterList');
    if (list.getAttribute('aria-hidden') === 'false') closeChapterList();
    else openChapterList();
  });
  document.getElementById('overlay').addEventListener('click', closeChapterList);

  document.getElementById('fontSmaller').addEventListener('click', () => {
    state.fontStep = clamp(state.fontStep - 1, FONT_MIN, FONT_MAX);
    applyFont();
    saveState({ fontStep: state.fontStep });
  });
  document.getElementById('fontLarger').addEventListener('click', () => {
    state.fontStep = clamp(state.fontStep + 1, FONT_MIN, FONT_MAX);
    applyFont();
    saveState({ fontStep: state.fontStep });
  });
  document.getElementById('themeToggle').addEventListener('click', () => {
    applyTheme(state.theme === 'dark' ? 'light' : 'dark');
    saveState({ theme: state.theme });
  });
  document.getElementById('prevChap').addEventListener('click', gotoPrev);
  document.getElementById('nextChap').addEventListener('click', gotoNext);

  // keyboard
  document.addEventListener('keydown', (e) => {
    const tag = e.target && e.target.tagName;
    if (tag === 'INPUT' || tag === 'TEXTAREA') return;
    if (e.key === 'ArrowLeft') gotoPrev();
    else if (e.key === 'ArrowRight') gotoNext();
    else if (e.key === 'Escape') closeChapterList();
  });

  // save scroll position
  const saveScroll = () => {
    if (!state.manifest) return;
    const book = state.manifest.books[state.currentBookIdx];
    if (!book) return;
    const ch = book.chapters[state.currentChapterIdx];
    if (!ch) return;
    const saved = readSaved();
    const scrolls = saved.scrolls || {};
    scrolls[`${book.id}/${ch.id}`] = window.scrollY;
    saveState({ scrolls });
  };

  if ('onscrollend' in window) {
    window.addEventListener('scrollend', saveScroll);
  } else {
    let timer = null;
    window.addEventListener('scroll', () => {
      if (timer) return;
      timer = setTimeout(() => { saveScroll(); timer = null; }, 500);
    }, { passive: true });
  }
}

init();
