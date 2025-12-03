import React, { useState, useEffect } from 'react';
import { Moon, Sun, Loader2, Sparkles, Copy, Check, History, Trash2, Download } from 'lucide-react';
import axios from 'axios';

function App() {
  const [darkMode, setDarkMode] = useState(false);
  const [text, setText] = useState('');
  const [summary, setSummary] = useState('');
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);
  const [history, setHistory] = useState([]);
  const [showHistory, setShowHistory] = useState(false);

  // Load history from local storage on mount
  useEffect(() => {
    const savedHistory = localStorage.getItem('summaryHistory');
    if (savedHistory) {
      setHistory(JSON.parse(savedHistory));
    }
  }, []);

  const toggleTheme = () => {
    setDarkMode(!darkMode);
    document.documentElement.classList.toggle('dark');
  };

  const handleSummarize = async () => {
    if (!text) return;
    setLoading(true);
    setSummary('');
    setCopied(false);
    try {
      const response = await axios.post('http://localhost:8000/summarize', { text });
      const newSummary = response.data.summary;
      setSummary(newSummary);

      // Add to history
      const newHistoryItem = {
        id: Date.now(),
        text: text.substring(0, 50) + '...',
        summary: newSummary,
        date: new Date().toLocaleTimeString()
      };

      const updatedHistory = [newHistoryItem, ...history].slice(0, 5); // Keep last 5
      setHistory(updatedHistory);
      localStorage.setItem('summaryHistory', JSON.stringify(updatedHistory));

    } catch (error) {
      console.error("Error summarizing:", error);
      setSummary("Failed to generate summary. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = async (textToCopy) => {
    if (!textToCopy) return;
    try {
      await navigator.clipboard.writeText(textToCopy);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  const handleDownload = () => {
    if (!summary) return;
    const element = document.createElement("a");
    const file = new Blob([summary], { type: 'text/plain' });
    element.href = URL.createObjectURL(file);
    element.download = "summary.txt";
    document.body.appendChild(element); // Required for this to work in FireFox
    element.click();
    document.body.removeChild(element);
  };

  const clearHistory = () => {
    setHistory([]);
    localStorage.removeItem('summaryHistory');
  };

  const loadFromHistory = (item) => {
    setText(item.text); // Note: We only saved the preview, ideally we save full text if we want to restore input. 
    // For now, let's just show the summary.
    setSummary(item.summary);
    setShowHistory(false);
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
            <div className="flex gap-2">
              <button
                onClick={() => setShowHistory(!showHistory)}
                className={`p-2 rounded-full transition-colors ${darkMode ? 'hover:bg-slate-700 text-slate-300' : 'hover:bg-slate-100 text-slate-600'}`}
                title="History"
              >
                <History className="w-5 h-5" />
              </button>
              <button
                onClick={toggleTheme}
                className={`p-2 rounded-full transition-colors ${darkMode ? 'hover:bg-slate-700 text-slate-300' : 'hover:bg-slate-100 text-slate-600'}`}
                title="Toggle Theme"
              >
                {darkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
              </button>
            </div>
          </div>

          {/* History View */}
          {showHistory ? (
            <div className="animate-in fade-in slide-in-from-top-4 duration-300">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-semibold">Recent History</h2>
                <button onClick={clearHistory} className="text-xs text-red-500 hover:text-red-600 flex items-center gap-1">
                  <Trash2 className="w-3 h-3" /> Clear
                </button>
              </div>
              {history.length === 0 ? (
                <p className="text-center opacity-50 py-8">No history yet.</p>
              ) : (
                <div className="space-y-3">
                  {history.map((item) => (
                    <div
                      key={item.id}
                      onClick={() => loadFromHistory(item)}
                      className={`p-3 rounded-lg cursor-pointer border transition-all ${darkMode
                        ? 'bg-slate-900/50 border-slate-700 hover:bg-slate-700'
                        : 'bg-slate-50 border-slate-200 hover:bg-slate-100'
                        }`}
                    >
                      <div className="flex justify-between text-xs opacity-50 mb-1">
                        <span>{item.date}</span>
                      </div>
                      <p className="text-sm line-clamp-2 opacity-80">{item.summary}</p>
                    </div>
                  ))}
                </div>
              )}
              <button
                onClick={() => setShowHistory(false)}
                className="w-full mt-6 py-2 text-sm font-medium text-blue-500 hover:text-blue-600"
              >
                Back to Summarizer
              </button>
            </div>
          ) : (
            <>
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
                  <div className={`relative p-6 rounded-xl border ${darkMode
                    ? 'bg-slate-900/50 border-slate-700'
                    : 'bg-blue-50/50 border-blue-100'
                    }`}>
                    <div className="absolute top-4 right-4 flex gap-2">
                      <button
                        onClick={handleDownload}
                        className={`flex items-center gap-1 text-xs font-medium px-2 py-1 rounded-md transition-colors ${darkMode
                            ? 'bg-slate-700 text-slate-300 hover:bg-slate-600'
                            : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                          }`}
                        title="Download .txt"
                      >
                        <Download className="w-3 h-3" />
                      </button>
                      <button
                        onClick={() => handleCopy(summary)}
                        className={`flex items-center gap-1 text-xs font-medium px-2 py-1 rounded-md transition-colors ${copied
                          ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
                          : 'bg-slate-100 text-slate-600 hover:bg-slate-200 dark:bg-slate-700 dark:text-slate-300 dark:hover:bg-slate-600'
                          }`}
                      >
                        {copied ? (
                          <>
                            <Check className="w-3 h-3" />
                            Copied
                          </>
                        ) : (
                          <>
                            <Copy className="w-3 h-3" />
                            Copy
                          </>
                        )}
                      </button>
                    </div>
                    <p className="leading-relaxed opacity-90 pr-20">{summary}</p>
                  </div>
                </div>
              )}
            </>
          )}

        </div>

        {/* Footer */}
        <p className="mt-8 text-sm opacity-50">Powered by HuggingFace Transformers</p>
      </div>
    </div>
  );
}

export default App;
