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
  menuView: 'chapters',   // 'books' | 'chapters'
  menuBookIdx: 0,         // which book the menu currently shows chapters of
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

  const saved = readSaved();
  const startBookIdx = clampIdx(saved.lastBook ?? 0, state.manifest.books.length);
  const startChapterIdx = clampIdx(
    saved.lastChapterByBook?.[state.manifest.books[startBookIdx].id] ?? 0,
    state.manifest.books[startBookIdx].chapters.length
  );
  state.currentBookIdx = startBookIdx;
  state.currentChapterIdx = startChapterIdx;
  state.menuBookIdx = startBookIdx;
  renderBooksView();
  renderChaptersView(startBookIdx);
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

/* ---------- menu: books view ---------- */
function bookSigil(book) {
  if (book.sigil) return book.sigil;
  // fallback: 「我在X...」取第 3 個字
  const t = book.title || '';
  return t.length >= 3 ? t.charAt(2) : (t.charAt(0) || '書');
}

function renderBooksView() {
  const ol = document.getElementById('booksOl');
  ol.innerHTML = '';

  state.manifest.books.forEach((book, bookIdx) => {
    const li = document.createElement('li');
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'book-card';
    if (bookIdx === state.currentBookIdx) btn.classList.add('active');
    btn.dataset.bookIdx = String(bookIdx);
    btn.setAttribute('aria-label', `${book.title}　${book.subtitle || ''}`);

    const sigil = document.createElement('span');
    sigil.className = 'book-card-sigil';
    sigil.textContent = bookSigil(book);
    sigil.setAttribute('aria-hidden', 'true');

    const textWrap = document.createElement('span');
    textWrap.className = 'book-card-text';

    const title = document.createElement('span');
    title.className = 'book-card-title';
    title.textContent = book.title;

    const subtitle = document.createElement('span');
    subtitle.className = 'book-card-subtitle';
    subtitle.textContent = book.subtitle || '';

    const meta = document.createElement('span');
    meta.className = 'book-card-meta';
    const parts = [`共 ${book.chapters.length} 篇`];
    if (book.status) parts.push(book.status);
    if (bookIdx === state.currentBookIdx) parts.push('閱讀中');
    meta.textContent = parts.join(' · ');

    textWrap.appendChild(title);
    if (book.subtitle) textWrap.appendChild(subtitle);
    textWrap.appendChild(meta);

    const arrow = document.createElement('span');
    arrow.className = 'book-card-arrow';
    arrow.textContent = '›';
    arrow.setAttribute('aria-hidden', 'true');

    btn.appendChild(sigil);
    btn.appendChild(textWrap);
    btn.appendChild(arrow);

    btn.addEventListener('click', () => {
      showChaptersView(bookIdx);
    });

    li.appendChild(btn);
    ol.appendChild(li);
  });
}

/* ---------- menu: chapters view ---------- */
function renderChaptersView(bookIdx) {
  const book = state.manifest.books[bookIdx];
  if (!book) return;

  const statusBadge = book.status ? ` · ${book.status}` : '';
  document.getElementById('chaptersViewTitle').textContent = book.title;
  document.getElementById('chaptersViewSubtitle').textContent =
    (book.subtitle || '') + statusBadge;

  const ol = document.getElementById('chaptersOl');
  ol.innerHTML = '';

  book.chapters.forEach((ch, chapterIdx) => {
    const li = document.createElement('li');
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.textContent = ch.title;
    btn.dataset.bookIdx = String(bookIdx);
    btn.dataset.chapterIdx = String(chapterIdx);
    if (bookIdx === state.currentBookIdx && chapterIdx === state.currentChapterIdx) {
      btn.classList.add('active');
    }
    btn.addEventListener('click', () => {
      loadChapter(bookIdx, chapterIdx);
      closeChapterList();
    });
    li.appendChild(btn);
    ol.appendChild(li);
  });
}

/* ---------- menu: view switching ---------- */
function showBooksView() {
  state.menuView = 'books';
  document.getElementById('booksView').hidden = false;
  document.getElementById('chaptersView').hidden = true;
  renderBooksView();
}

function showChaptersView(bookIdx) {
  state.menuView = 'chapters';
  state.menuBookIdx = bookIdx;
  document.getElementById('booksView').hidden = true;
  document.getElementById('chaptersView').hidden = false;
  renderChaptersView(bookIdx);
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

  // update list highlight (chapters view)
  document.querySelectorAll('#chaptersOl button').forEach((b) => {
    const active = Number(b.dataset.bookIdx) === bookIdx && Number(b.dataset.chapterIdx) === chapterIdx;
    b.classList.toggle('active', active);
  });
  // update books view highlight (current book card)
  document.querySelectorAll('#booksOl .book-card').forEach((b) => {
    b.classList.toggle('active', Number(b.dataset.bookIdx) === bookIdx);
  });
  // if user switched book via menu, also refresh chapters view header to match
  if (state.menuBookIdx !== bookIdx) {
    state.menuBookIdx = bookIdx;
    renderChaptersView(bookIdx);
  }

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

  // 打開時預設顯示「目前正在閱讀的書」的章節列表
  if (state.menuView === 'chapters') {
    showChaptersView(state.currentBookIdx);
  } else {
    showBooksView();
  }

  // 自動捲到目前章節
  setTimeout(() => {
    list.scrollTop = 0;
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
  document.getElementById('backToBooks').addEventListener('click', showBooksView);

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
