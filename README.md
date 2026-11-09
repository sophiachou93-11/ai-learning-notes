# STACK NOTE — AI × CS 觀念筆記庫

一個用 **HTML + CSS + 原生 JavaScript + JSON** 製作的繁體中文學習筆記網站。把 AI Agent、RAG、Huffman Coding、虛擬記憶體、LRU 與量子計算等概念，整理成容易快速複習的短篇筆記。

> **本作業的重點是 `AGENTS.md`**：先定義一套開發與內容規則，未來要新增筆記時，AI 只要按照規範更新資料，便能自動套用首頁卡片與統一的詳情頁版型。

## 功能

- 分類篩選：人工智慧、資料結構、作業系統、量子計算。
- 即時搜尋：搜尋標題、摘要、標籤及分類。
- 共用詳情頁：`note.html?id=筆記ID`，不需為每篇筆記複製 HTML。
- 自動計數：依資料顯示筆記篇數與分類數。
- 支援手機、鍵盤操作與無搜尋結果提示。

## 檔案

| 檔案 | 用途 |
| --- | --- |
| `AGENTS.md` | AI 的完整開發規範、內容格式、驗收清單 |
| `index.html` | 網站首頁與筆記列表 |
| `note.html` | 所有筆記共用的詳情頁 |
| `assets/` | CSS、首頁及詳情頁程式 |
| `data/notes.json` | 唯一的筆記資料來源 |
| `tools/validate_notes.py` | 驗證 JSON 結構、分類與 id |
| `SUBMISSION.md` | 作業繳交文字模板 |

## 本機預覽

需要 Python 3。請在專案最外層目錄執行：

```bash
python tools/validate_notes.py
python -m http.server 8000
```

瀏覽器開啟 `http://localhost:8000`。**請勿直接雙擊 `index.html`**，因為瀏覽器可能阻擋本機 `file://` 讀取 JSON。

## 如何用 AI 繼續新增一篇？

1. 請 AI 先閱讀 `AGENTS.md`。
2. 使用下方指令：

   > 請先閱讀 AGENTS.md，依照規定新增一篇「Binary Search（二分搜尋）」筆記，分類是資料結構。只修改 data/notes.json，完成後執行 tools/validate_notes.py 驗證。

3. AI 在 `data/notes.json` 新增物件，不需要再建立新的 HTML。
4. 首頁會自動出現卡片，點開後共用 `note.html?id=binary-search` 版型。

## 上傳 GitHub 與部署 GitHub Pages

1. 在 GitHub 新增 **Public repository**，名稱建議 `ai-learning-notes`。
2. 將解壓縮後專案資料夾**裡面的全部檔案**上傳到 Repository 根目錄，確認 `index.html` 與 `AGENTS.md` 都在最外層。
3. 進入 Repository → **Settings** → **Pages**。
4. 在 **Build and deployment** 選 **Deploy from a branch**；Branch 選 `main`，資料夾選 `/(root)`，按 **Save**。
5. 等部署完成後，到 Pages 設定按 **Visit site**。

網址通常會是：

- Repository：`https://github.com/<你的GitHub帳號>/ai-learning-notes`
- 網站：`https://<你的GitHub帳號>.github.io/ai-learning-notes/`

這些是格式示例，請換成實際帳號與上傳成功的網址；**目前範例專案尚未替你發布到 GitHub**。

## 設計特色

與「只做一個單頁網頁」不同，此專案採取**資料與版面分離**。每一篇筆記的內容都遵循同一套 JSON 規範，顯示邏輯由 JS 共用，視覺風格由 CSS 管理。未來加入第 7、20、100 篇筆記時，不必改動首頁卡片的 HTML，也不需製作新的詳情頁模板。
