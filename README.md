# 我在藏經閣當首席檢索官 — 閱讀器

純前端、單一資料夾、零建置工具。章節以 markdown 存，新增章節只要在 `chapters/` 丟一個 `.md` 並更新 `manifest.json`。

## 結構

```
reader/
├── index.html
├── styles.css
├── app.js
├── chapters/
│   ├── manifest.json   章節清單（順序、檔名、標題）
│   └── ch01.md         第 1 章 markdown
└── README.md
```

## 本地預覽

不能直接雙擊 `index.html`（瀏覽器會阻擋 `fetch()` 讀本地檔）。需要起一個小 HTTP server：

```powershell
cd C:\Users\User\Desktop\learning\reader
python -m http.server 8000
```

瀏覽器打開 <http://localhost:8000>。

### 手機在同一個 WiFi 看（外出測試的中繼站）

1. 電腦 PowerShell 跑 `ipconfig` 看本機 IP（例如 `192.168.0.42`）
2. 手機瀏覽器打開 `http://192.168.0.42:8000`
3. 需要先關閉防火牆對 8000 port 的封鎖，或設一條允許規則

## 部署到網路（外出真的能讀）

### 選項 A：GitHub Pages（推薦，免費、永久）

```powershell
cd C:\Users\User\Desktop\learning\reader
git init
git add .
git commit -m "init reader"
gh repo create tibetan-reader --public --source=. --push
gh api -X POST repos/:owner/tibetan-reader/pages -f source[branch]=main -f source[path]=/
```

幾分鐘後可在 `https://<your-github-user>.github.io/tibetan-reader/` 開啟。

### 選項 B：Vercel（最快，30 秒）

```powershell
cd C:\Users\User\Desktop\learning\reader
npx vercel
```

按提示登入＋確認，得到一個 `https://xxx.vercel.app` 連結。

### 選項 C：Netlify Drop（零指令）

打開 <https://app.netlify.com/drop>，把整個 `reader/` 資料夾拖進去，得到一個公開連結。

## 加章節

1. 在 `chapters/` 新增 `ch02.md`、`ch03.md` …
2. 編輯 `chapters/manifest.json`：

   ```json
   {
     "title": "我在藏經閣當首席檢索官",
     "subtitle": "林知行的 RAG 修行錄",
     "chapters": [
       { "id": "ch01", "title": "第 1 章　幻覺", "file": "ch01.md" },
       { "id": "ch02", "title": "第 2 章　切典",  "file": "ch02.md" }
     ]
   }
   ```

3. 重新整理頁面就會看到新章節。
4. 若已部署到 GitHub Pages / Vercel，`git push` 後自動更新。

## 特殊樣式

雜役筆記與「訣」總結用 raw HTML 包：

```markdown
<div class="notes-box">

## 雜役筆記

...

</div>
```

```markdown
<div class="takeaway-box">

## 這一章你只要記得這三件事

...

</div>
```

兩個 `<div>` 開頭與結尾各留一個空行，marked.js 才會把裡面的 markdown 正確解析。

## 鍵盤快捷

| 按鍵 | 動作 |
|---|---|
| `←` | 上一章 |
| `→` | 下一章 |
| `Esc` | 關閉章節目錄 |

## 設定持久化

字級、明暗主題、最後讀到的章節、每章捲動位置，都用 `localStorage` 記在瀏覽器，下次打開直接回到原點。
