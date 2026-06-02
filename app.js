/* =========================================
   藏經閣讀經器
   ========================================= */
const STORAGE_KEY = 'tibetan-reader-state';
const FONT_MIN = -2;
const FONT_MAX = 4;

const state = {
  manifest: null,
  currentIdx: 0,
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

  document.title = state.manifest.title;
  renderChapterList();

  const saved = readSaved();
  const startIdx = Math.min(
    Math.max(saved.lastChapter ?? 0, 0),
    state.manifest.chapters.length - 1
  );
  await loadChapter(startIdx);

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

/* ---------- chapter list ---------- */
function renderChapterList() {
  const ol = document.getElementById('chaptersOl');
  ol.innerHTML = '';
  state.manifest.chapters.forEach((ch, i) => {
    const li = document.createElement('li');
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.textContent = ch.title;
    btn.dataset.idx = String(i);
    btn.addEventListener('click', () => {
      loadChapter(i);
      closeChapterList();
    });
    li.appendChild(btn);
    ol.appendChild(li);
  });
}

/* ---------- chapter loading ---------- */
async function loadChapter(idx) {
  if (!state.manifest) return;
  if (idx < 0 || idx >= state.manifest.chapters.length) return;
  state.currentIdx = idx;
  const ch = state.manifest.chapters[idx];

  const content = document.getElementById('content');
  content.innerHTML = '<div class="loading" role="status" aria-label="載入中"><span class="loading-sigil" aria-hidden="true">❖</span></div>';

  let md;
  try {
    const res = await fetch('chapters/' + ch.file, { cache: 'no-cache' });
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

  // restore scroll position
  const saved = readSaved();
  const scrolls = saved.scrolls || {};
  window.scrollTo(0, scrolls[ch.id] || 0);

  // update list highlight
  document.querySelectorAll('#chaptersOl button').forEach((b) => {
    b.classList.toggle('active', Number(b.dataset.idx) === idx);
  });

  // nav buttons
  document.getElementById('prevChap').disabled = idx === 0;
  document.getElementById('nextChap').disabled = idx === state.manifest.chapters.length - 1;
  document.getElementById('navProgress').textContent =
    String(idx + 1).padStart(2, '0') + ' / ' + String(state.manifest.chapters.length).padStart(2, '0');

  saveState({ lastChapter: idx });
}

function showError(msg) {
  const content = document.getElementById('content');
  content.innerHTML = '<p style="color:var(--accent);text-align:center;padding:60px 0;text-indent:0;">' + msg + '</p>';
}

/* ---------- settings ---------- */
function applyFont() {
  const base = 18;
  const size = base + state.fontStep * 2;
  document.documentElement.style.setProperty('--font-size', size + 'px');
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
  document.getElementById('prevChap').addEventListener('click', () => loadChapter(state.currentIdx - 1));
  document.getElementById('nextChap').addEventListener('click', () => loadChapter(state.currentIdx + 1));

  // keyboard nav
  document.addEventListener('keydown', (e) => {
    const tag = e.target && e.target.tagName;
    if (tag === 'INPUT' || tag === 'TEXTAREA') return;
    if (e.key === 'ArrowLeft') loadChapter(state.currentIdx - 1);
    else if (e.key === 'ArrowRight') loadChapter(state.currentIdx + 1);
    else if (e.key === 'Escape') closeChapterList();
  });

  // save scroll position (prefer scrollend, fallback to throttled scroll)
  const saveScroll = () => {
    const ch = state.manifest && state.manifest.chapters[state.currentIdx];
    if (!ch) return;
    const saved = readSaved();
    const scrolls = saved.scrolls || {};
    scrolls[ch.id] = window.scrollY;
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
