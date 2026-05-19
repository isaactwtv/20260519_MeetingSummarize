import { GoogleGenAI } from "@google/genai";
import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = 3000;

// Initialize Gemini
const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY || "",
  httpOptions: {
    headers: {
      'User-Agent': 'aistudio-build',
    }
  }
});

app.use(express.json());

const SYSTEM_PROMPT = `
你是一位專業的會議記錄秘書。請針對使用者提供的會議逐字稿或筆記進行處理。
你的任務是：
1. **會議摘要**：總結會議的核心內容。
2. **重點整理**：列出會議中討論的關鍵點。
3. **行動清單**：提取出所有後續需要執行的事項（Action Items），並標註負責人（若有）。
4. **語言處理**：
   - 若原始內容非繁體中文，請在摘要後提供一份專業的「繁體中文翻譯」。
   - 若原始內容已為繁體中文，請優化措辭並保持專業。
5. **格式規範**：
   - 使用 Markdown 格式。
   - 使用清晰的標題（例如：## 💡 會議摘要, ## 📌 關鍵討論, ## 🚀 行動清單）。
   - 語氣必須正式且專業。
   - 所有輸出內容必須使用「繁體中文」。
`;

// API Routes
app.post("/api/generate", async (req, res) => {
  const { content } = req.body;

  if (!content) {
    return res.status(400).json({ error: "請提供內容" });
  }

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: content,
      config: {
        systemInstruction: SYSTEM_PROMPT,
        temperature: 0.7,
      },
    });

    res.json({ result: response.text });
  } catch (error: any) {
    console.error("Gemini Error:", error);
    res.status(500).json({ error: "AI 處理失敗，請稍後再試。" });
  }
});

// Vite Middleware
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
