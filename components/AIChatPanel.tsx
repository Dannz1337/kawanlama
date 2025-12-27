
import React, { useState, useRef, useEffect } from 'react';
import { getAIResponse } from '../services/geminiService';
import { ReceiptData } from '../types';

interface AIChatPanelProps {
  currentData: ReceiptData;
}

const AIChatPanel: React.FC<AIChatPanelProps> = ({ currentData }) => {
  const [messages, setMessages] = useState<{ role: 'user' | 'ai'; text: string }[]>([
    { role: 'ai', text: 'Halo! Saya asisten AI KawanLama. Ada yang bisa saya bantu dengan nota rental Anda?' }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || loading) return;

    const userMsg = input;
    setMessages(prev => [...prev, { role: 'user', text: userMsg }]);
    setInput('');
    setLoading(true);

    try {
      const aiResponse = await getAIResponse(userMsg, currentData);
      setMessages(prev => [...prev, { role: 'ai', text: aiResponse || "Maaf, saya tidak mengerti." }]);
    } catch (error) {
      setMessages(prev => [...prev, { role: 'ai', text: "Terjadi kesalahan saat menghubungi asisten AI." }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-lg border border-gray-200 h-[600px] flex flex-col no-print">
      <div className="p-4 border-b bg-blue-600 text-white rounded-t-xl flex items-center justify-between">
        <h2 className="font-bold flex items-center">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M18 10c0 3.866-3.582 7-8 7a8.841 8.841 0 01-4.083-.98L2 17l1.338-3.123C2.493 12.767 2 11.434 2 10c0-3.866 3.582-7 8-7s8 3.134 8 7zM7 9H5v2h2V9zm8 0h-2v2h2V9zM9 9h2v2H9V9z" clipRule="evenodd" />
          </svg>
          AI Assistant Support
        </h2>
        <span className="text-xs bg-blue-500 px-2 py-1 rounded">Gemini Pro</span>
      </div>
      
      <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
        {messages.map((m, i) => (
          <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[80%] p-3 rounded-lg text-sm ${
              m.role === 'user' ? 'bg-blue-500 text-white' : 'bg-white border border-gray-300 shadow-sm text-gray-800'
            }`}>
              {m.text}
            </div>
          </div>
        ))}
        {loading && (
          <div className="flex justify-start">
            <div className="bg-white border border-gray-300 shadow-sm text-gray-500 text-sm p-3 rounded-lg italic">
              AI sedang berpikir...
            </div>
          </div>
        )}
      </div>

      <div className="p-4 border-t flex space-x-2 bg-white rounded-b-xl">
        <input 
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && handleSend()}
          placeholder="Tanya asisten tentang nota..."
          className="flex-1 p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 outline-none text-sm"
        />
        <button 
          onClick={handleSend}
          disabled={loading}
          className="bg-blue-600 text-white p-2 rounded hover:bg-blue-700 transition-colors disabled:opacity-50"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z" />
          </svg>
        </button>
      </div>
    </div>
  );
};

export default AIChatPanel;
