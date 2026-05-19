# AI 會議記錄生成與翻譯工具

這是一個基於 React (Vite) + Express (Node.js) 開發的 AI 會議助手，使用 Gemini API 自動為您生成會議摘要、重點討論和行動清單。

---

## 本地開發 (Local Development)

### 準備工作 (Prerequisites)
- 安裝 [Node.js](https://nodejs.org/) (建議 v18 以上)

### 啟動步驟
1. **安裝依賴套件：**
   ```bash
   npm install
   ```
2. **設定環境變數：**
   複製 `.env.example` 為 `.env`：
   ```bash
   cp .env.example .env
   ```
   並填入您的 Gemini API 金鑰：
   ```env
   GEMINI_API_KEY="您的金鑰"
   ```
3. **啟動開發伺服器：**
   ```bash
   npm run dev
   ```
   啟動後，瀏覽器打開 `http://localhost:3000` 即可使用。

---

## 部署指南 (Deployment Guide)

本專案已做好優化，支援以下主流部署管道：

### 1. 部署到 Vercel (推薦)
Vercel 會將前端 React 程式碼託管於 CDN，並自動將 Express 後端轉換為 Serverless Functions（執行於 `/api` 路由下），無需維護持續運行的伺服器，完全免費且快速。

- **步驟：**
  1. 在您的 GitHub 帳號中匯入此專案的 Repository。
  2. 在 Vercel 控制台點擊 **Add New Project** 匯入該 repo。
  3. 在設定面板的 **Environment Variables** 欄位新增環境變數：
     - `GEMINI_API_KEY`: 您的 Gemini API Key。
     - `GEMINI_MODEL`: (選填) `gemini-3-flash-preview` 或 `gemini-2.5-flash`。
  4. 點擊 **Deploy**，Vercel 將自動為您完成建置與發佈。

### 2. 部署到 Render / Railway
適用於傳統 Node.js 伺服器託管平台。

- **建置與啟動指令：**
  - **Build Command:** `npm run build` (會同時建置 Vite 前端與打包 Express 後端)
  - **Start Command:** `npm start`
- **環境變數設定：**
  - 請在平台設定頁面新增 `GEMINI_API_KEY` 與 `PORT`（通常平台會自動注入 `PORT`，本專案會自動讀取它）。

