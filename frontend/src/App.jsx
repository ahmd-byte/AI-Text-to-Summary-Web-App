import React, { useState } from 'react';
import { Moon, Sun, Loader2, Sparkles } from 'lucide-react';
import axios from 'axios';

function App() {
  const [darkMode, setDarkMode] = useState(false);
  const [text, setText] = useState('');
  const [summary, setSummary] = useState('');
  const [loading, setLoading] = useState(false);

  const toggleTheme = () => {
    setDarkMode(!darkMode);
    document.documentElement.classList.toggle('dark');
  };

  const handleSummarize = async () => {
    if (!text) return;
    setLoading(true);
    setSummary(''); // Clear previous summary
    try {
      // Real API call
      const response = await axios.post('http://localhost:8000/summarize', { text });
      setSummary(response.data.summary);
    } catch (error) {
      console.error("Error summarizing:", error);
      setSummary("Failed to generate summary. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={`min-h-screen transition-colors duration-300 ${darkMode ? 'bg-slate-900 text-white' : 'bg-slate-50 text-slate-900'}`}>
      <div className="container mx-auto px-4 py-10 flex flex-col items-center justify-center min-h-screen">

        {/* Card Container */}
        <div className={`w-full max-w-xl rounded-2xl shadow-xl p-8 transition-all duration-300 ${darkMode ? 'bg-slate-800 shadow-slate-900/50' : 'bg-white shadow-slate-200'}`}>

          {/* Header */}
          <div className="flex justify-between items-center mb-8">
            <div className="flex items-center gap-2">
              <div className="p-2 bg-blue-600 rounded-lg">
                <Sparkles className="w-6 h-6 text-white" />
              </div>
              <h1 className="text-2xl font-bold tracking-tight">AI Summarizer</h1>
            </div>
            <button
              onClick={toggleTheme}
              className={`p-2 rounded-full transition-colors ${darkMode ? 'hover:bg-slate-700 text-slate-300' : 'hover:bg-slate-100 text-slate-600'}`}
            >
              {darkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </button>
          </div>

          {/* Input Area */}
          <div className="mb-6">
            <label className="block text-sm font-medium mb-2 opacity-70">Input Text</label>
            <textarea
              className={`w-full h-48 p-4 rounded-xl border focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none resize-none transition-all ${darkMode
                ? 'bg-slate-900 border-slate-700 placeholder-slate-500'
                : 'bg-slate-50 border-slate-200 placeholder-slate-400'
                }`}
              placeholder="Paste your text here to summarize..."
              value={text}
              onChange={(e) => setText(e.target.value)}
            />
          </div>

          {/* Action Button */}
          <button
            onClick={handleSummarize}
            disabled={loading || !text}
            className={`w-full py-3 px-6 rounded-xl font-semibold text-white transition-all transform active:scale-[0.98] flex items-center justify-center gap-2 ${loading || !text
              ? 'bg-slate-400 cursor-not-allowed'
              : 'bg-blue-600 hover:bg-blue-700 shadow-lg shadow-blue-600/30'
              }`}
          >
            {loading ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                Summarizing...
              </>
            ) : (
              <>
                <Sparkles className="w-5 h-5" />
                Summarize Text
              </>
            )}
          </button>

          {/* Summary Output */}
          {summary && (
            <div className="mt-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
              <label className="block text-sm font-medium mb-2 opacity-70 text-blue-500">Summary Result</label>
              <div className={`p-6 rounded-xl border ${darkMode
                ? 'bg-slate-900/50 border-slate-700'
                : 'bg-blue-50/50 border-blue-100'
                }`}>
                <p className="leading-relaxed opacity-90">{summary}</p>
              </div>
            </div>
          )}

        </div>

        {/* Footer */}
        <p className="mt-8 text-sm opacity-50">Powered by HuggingFace Transformers</p>
      </div>
    </div>
  );
}

export default App;
