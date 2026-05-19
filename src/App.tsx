import { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  FileText, 
  Send, 
  Copy, 
  Check, 
  Loader2, 
  Sparkles,
  ClipboardList,
  Languages
} from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import { cn } from './lib/utils';

export default function App() {
  const [inputText, setInputText] = useState('');
  const [result, setResult] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isCopied, setIsCopied] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const resultRef = useRef<HTMLDivElement>(null);

  const handleGenerate = async () => {
    if (!inputText.trim()) return;
    
    setIsLoading(true);
    setError(null);
    setResult('');
    
    try {
      const response = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content: inputText }),
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || '發生錯誤');
      }
      
      setResult(data.result);
    } catch (err: any) {
      setError(err.message || '連線失敗，請檢查網路或稍後再試。');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopy = async () => {
    if (!result) return;
    try {
      await navigator.clipboard.writeText(result);
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
    } catch (err) {
      console.error('複製失敗:', err);
    }
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] font-sans text-slate-900 selection:bg-indigo-100 flex flex-col overflow-hidden">
      {/* Top Navigation */}
      <header className="h-16 px-6 md:px-8 flex items-center justify-between bg-white border-b border-slate-200 shrink-0 sticky top-0 z-10">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center shadow-lg shadow-indigo-100">
            <ClipboardList className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="text-lg md:text-xl font-bold tracking-tight text-slate-800 flex items-center gap-2">
              AI 會議助手 <span className="text-slate-400 font-normal text-sm">v2.0</span>
            </h1>
          </div>
        </div>
        <div className="hidden sm:flex items-center gap-6">
          <div className="flex items-center gap-2 text-[11px] md:text-xs text-slate-500 font-medium bg-slate-100 px-3 py-1.5 rounded-full">
            <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
            Gemini Pro 模型已就緒
          </div>
          <div className="flex items-center gap-4">
             <div className="w-8 h-8 rounded-full bg-slate-200 border-2 border-white shadow-sm overflow-hidden flex items-center justify-center">
               <span className="text-[10px] font-bold text-slate-500">AI</span>
             </div>
          </div>
        </div>
      </header>

      {/* Main Content Layout */}
      <main className="flex-1 flex flex-col lg:flex-row overflow-hidden relative">
        {/* Left Pane: Input */}
        <div className="w-full lg:w-1/2 flex flex-col p-6 border-r border-slate-200 bg-white">
          <div className="flex items-center justify-between mb-4 px-1">
            <div className="flex items-center gap-2">
              <span className="flex items-center justify-center w-6 h-6 rounded bg-slate-100 text-[10px] font-bold text-slate-500">1</span>
              <h2 className="font-semibold text-sm text-slate-700">輸入會議內容</h2>
            </div>
            <span className="text-[10px] text-slate-400 font-medium uppercase tracking-wider">支援繁體中文 (UTF-8)</span>
          </div>
          
          <div className="flex-1 relative group mt-2">
            <textarea
              id="transcript"
              className="w-full h-full min-h-[300px] p-5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all resize-none text-slate-600 leading-relaxed outline-none placeholder:text-slate-300"
              placeholder="在此貼上會議逐字稿、重點摘要或任何需要處理的內容...&#10;&#10;範例：&#10;小明：今天我們來討論專案 A 的進度。&#10;小華：目前後端開發進度已達 80%..."
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
            />
            <div className="absolute bottom-4 right-4 text-[10px] text-slate-400 font-medium tabular-nums shadow-sm bg-white/50 backdrop-blur px-2 py-1 rounded">
              已輸入 {inputText.length} 字
            </div>
          </div>

          <div className="mt-6">
            <button
              onClick={handleGenerate}
              disabled={isLoading || !inputText.trim()}
              className={cn(
                "w-full h-12 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-xl flex items-center justify-center gap-2 shadow-lg shadow-indigo-100 transition-all active:scale-[0.98] disabled:opacity-50 disabled:active:scale-100 disabled:shadow-none",
                isLoading && "cursor-not-allowed"
              )}
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  生成會議總結與翻譯中...
                </>
              ) : (
                <>
                  <Sparkles className="w-5 h-5" />
                  生成會議總結與翻譯
                </>
              )}
            </button>
          </div>
        </div>

        {/* Right Pane: Output */}
        <div className="w-full lg:w-1/2 flex flex-col p-6 bg-slate-50/50 overflow-hidden">
          <div className="flex items-center justify-between mb-4 px-1">
            <div className="flex items-center gap-2">
              <span className="flex items-center justify-center w-6 h-6 rounded bg-indigo-100 text-[10px] font-bold text-indigo-600">2</span>
              <h2 className="font-semibold text-sm text-slate-700">AI 生成結果</h2>
            </div>
            {result && (
              <button
                onClick={handleCopy}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-white border border-slate-200 rounded-lg text-[10px] font-bold text-indigo-600 hover:bg-slate-50 transition-colors shadow-sm uppercase tracking-wider"
              >
                {isCopied ? (
                  <><Check className="w-3.5 h-3.5" /> 已複製</>
                ) : (
                  <><Copy className="w-3.5 h-3.5" /> 一鍵複製</>
                )}
              </button>
            )}
          </div>

          <div 
            className={cn(
              "flex-1 bg-white border border-slate-200 rounded-xl shadow-sm relative overflow-hidden",
              !result && !isLoading && !error ? "flex items-center justify-center border-dashed bg-slate-100/50" : ""
            )}
          >
            <AnimatePresence mode="wait">
              {isLoading ? (
                <motion.div
                  key="loading"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="absolute inset-0 flex flex-col items-center justify-center gap-4 p-8 text-center"
                >
                  <div className="relative">
                    <div className="w-12 h-12 border-4 border-indigo-50 rounded-full border-t-indigo-600 animate-spin" />
                    <div className="absolute inset-0 flex items-center justify-center">
                      <Sparkles className="w-5 h-5 text-indigo-600 animate-pulse" />
                    </div>
                  </div>
                  <div>
                    <p className="font-bold text-slate-700">AI 正在分析內容...</p>
                    <p className="text-[11px] text-slate-400 mt-1 uppercase tracking-wider">這可能需要幾秒鐘的時間</p>
                  </div>
                </motion.div>
              ) : error ? (
                <motion.div
                  key="error"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="p-8 h-full flex flex-col items-center justify-center text-center"
                >
                  <div className="w-12 h-12 bg-red-50 text-red-500 rounded-full flex items-center justify-center mb-4">
                    <FileText className="w-6 h-6" />
                  </div>
                  <p className="text-sm text-red-600 font-semibold">{error}</p>
                  <button 
                    onClick={handleGenerate}
                    className="mt-6 text-xs font-bold text-slate-400 hover:text-slate-600 uppercase tracking-widest transition-all"
                  >
                    重新嘗試
                  </button>
                </motion.div>
              ) : result ? (
                <motion.div
                  key="result"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="h-full overflow-y-auto p-6 md:p-8"
                  ref={resultRef}
                >
                  <div className="prose prose-slate prose-sm max-w-none">
                    <ReactMarkdown>{result}</ReactMarkdown>
                  </div>
                </motion.div>
              ) : (
                <motion.div
                  key="empty"
                  className="p-8 flex flex-col items-center justify-center text-slate-300 text-center"
                >
                  <ClipboardList className="w-12 h-12 mb-4 opacity-10" />
                  <p className="text-sm font-bold text-slate-400">尚未生成結果</p>
                  <p className="text-[10px] mt-1 uppercase tracking-wider">請在左側輸入會議內容後點擊生成</p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <div className="mt-4 px-4 py-3 bg-indigo-50/50 border border-indigo-100 rounded-xl">
            <p className="text-[9px] text-indigo-600 font-bold uppercase tracking-[0.1em] mb-1">系統提示 (System Prompt)</p>
            <p className="text-[11px] text-indigo-900/70 line-clamp-1 italic">
              專業秘書身份、Markdown 格式、摘要/重點/行動清單/翻譯...
            </p>
          </div>
        </div>
      </main>

      {/* Footer Bar */}
      <footer className="h-10 bg-white border-t border-slate-200 px-6 flex items-center justify-between shrink-0 relative z-10">
        <div className="text-[9px] text-slate-400 font-bold uppercase tracking-[0.2em]">
          Built with React + Gemini AI
        </div>
        <div className="flex items-center gap-6 text-[10px] font-bold text-slate-500 uppercase tracking-wider">
          <span className="hover:text-indigo-600 cursor-pointer transition-colors">隱私條款</span>
          <span className="hover:text-indigo-600 cursor-pointer transition-colors">使用說明</span>
        </div>
      </footer>

      {/* Global Markdown Styles */}
      <style>{`
        .prose h2 {
          font-size: 1.125rem;
          margin-top: 2rem;
          margin-bottom: 1rem;
          color: #1e293b;
          font-weight: 700;
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }
        .prose h3 {
          font-size: 1rem;
          margin-top: 1.5rem;
          margin-bottom: 0.75rem;
          color: #334155;
          font-weight: 600;
        }
        .prose p {
          margin-top: 0.75rem;
          margin-bottom: 0.75rem;
          line-height: 1.7;
          color: #475569;
        }
        .prose ul, .prose ol {
          margin-top: 0.75rem;
          margin-bottom: 0.75rem;
          padding-left: 1.5rem;
        }
        .prose li {
          margin-top: 0.4rem;
          margin-bottom: 0.4rem;
          color: #475569;
        }
        .prose strong {
          color: #1e293b;
          font-weight: 600;
        }
        .prose hr {
          border-top-color: #f1f5f9;
          margin: 2rem 0;
        }
        /* Mobile Scroll adjustments */
        @media (max-width: 1023px) {
          main {
            overflow-y: auto;
          }
          .lg\\:w-1\\/2 {
            height: auto !important;
            overflow: visible !important;
          }
          .flex-1.bg-white {
            min-height: 400px;
          }
        }
      `}</style>
    </div>
  );
}
