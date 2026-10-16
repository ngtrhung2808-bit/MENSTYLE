import React, { useState, useRef, useEffect } from 'react';
import { MessageSquare, X, Send, Bot, Sparkles, ShoppingBag, Loader2, Key } from 'lucide-react';
import { Button } from '../common/Button';
import { generateStylistChatReply, getGeminiApiKey, setGeminiApiKey } from '../../services/geminiService';

export const ChatbotWidget = ({ products = [], onSelectProduct }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      id: 1,
      sender: 'bot',
      text: 'Xin chào quý ông! Tôi là Stylist AI của MENSTYLE (được tích hợp Gemini AI). Bạn đang tìm trang phục cho dịp nào: công sở, dạ tiệc hay dạo phố cuối tuần?',
      time: 'Vừa xong'
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [loading, setLoading] = useState(false);
  const [showKeyModal, setShowKeyModal] = useState(false);
  const [apiKeyInput, setApiKeyInput] = useState(getGeminiApiKey());
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
    }
  }, [messages, isOpen]);

  const quickQuestions = [
    'Tư vấn phối đồ đi tiệc cưới',
    'Set đồ đi làm công sở lịch sự',
    'Gợi ý áo polo thoáng mát mùa hè',
    'Chính sách đổi trả hàng'
  ];

  const handleSend = async (textToSend) => {
    const text = textToSend || inputValue;
    if (!text.trim() || loading) return;

    const userMsg = {
      id: Date.now(),
      sender: 'user',
      text: text.trim(),
      time: 'Vừa xong'
    };

    setMessages(prev => [...prev, userMsg]);
    setInputValue('');
    setLoading(true);

    try {
      const replyText = await generateStylistChatReply(messages, text.trim(), products);
      
      // Tìm sản phẩm liên quan gợi ý kèm tin nhắn nếu có
      let suggestedItem = null;
      const lower = text.toLowerCase();
      if (lower.includes('polo')) {
        suggestedItem = products.find(p => p.category === 'Áo Polo');
      } else if (lower.includes('sơ mi')) {
        suggestedItem = products.find(p => p.category === 'Áo Sơ Mi');
      } else if (lower.includes('quần') || lower.includes('âu')) {
        suggestedItem = products.find(p => p.category === 'Quần Âu Công Sở');
      } else if (lower.includes('blazer') || lower.includes('tiệc')) {
        suggestedItem = products.find(p => p.category === 'Áo Khoác & Blazer');
      }

      setMessages(prev => [
        ...prev,
        {
          id: Date.now() + 1,
          sender: 'bot',
          text: replyText,
          suggestedItem,
          time: 'Vừa xong'
        }
      ]);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSaveApiKey = (e) => {
    e.preventDefault();
    setGeminiApiKey(apiKeyInput);
    setShowKeyModal(false);
    setMessages(prev => [
      ...prev,
      {
        id: Date.now(),
        sender: 'bot',
        text: 'Đã lưu cấu hình Gemini API Key thành công! Stylist AI hiện đã kết nối trực tiếp với mô hình Gemini AI 2.5 Flash.',
        time: 'Vừa xong'
      }
    ]);
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end">
      {/* Cửa sổ Chat Popup */}
      {isOpen && (
        <div className="w-[92vw] sm:w-[400px] bg-white rounded-3xl shadow-2xl border border-neutral-200 overflow-hidden flex flex-col h-[520px] mb-4 animate-in slide-in-from-bottom-5 duration-300">
          {/* Header Chatbot */}
          <div className="bg-neutral-950 text-white p-4 flex items-center justify-between border-b border-neutral-800">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-amber-500 to-amber-300 text-neutral-950 flex items-center justify-center font-black shadow-md">
                <Bot className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-sm font-bold flex items-center gap-1.5">
                  Stylist AI MENSTYLE 
                  <span className="text-[9px] bg-amber-500/20 text-amber-300 px-1.5 py-0.2 rounded border border-amber-400/30">
                    Gemini AI
                  </span>
                </h3>
                <p className="text-[10px] text-emerald-400 font-semibold flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping"></span>
                  Trợ lý tư vấn gu ăn mặc 24/7
                </p>
              </div>
            </div>

            <div className="flex items-center gap-1">
              <button
                onClick={() => setShowKeyModal(true)}
                title="Cài đặt API Key Gemini"
                className="p-1.5 rounded-lg text-neutral-400 hover:text-amber-400 hover:bg-neutral-800 transition cursor-pointer"
              >
                <Key className="w-4 h-4" />
              </button>
              <button 
                onClick={() => setIsOpen(false)}
                className="p-1.5 rounded-lg text-neutral-400 hover:text-white hover:bg-neutral-800 transition cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Form cài đặt API Key nhanh */}
          {showKeyModal && (
            <div className="p-3 bg-amber-50 border-b border-amber-200 text-xs">
              <div className="flex justify-between items-center mb-1">
                <span className="font-bold text-amber-900">Cấu hình Gemini API Key:</span>
                <button onClick={() => setShowKeyModal(false)} className="text-neutral-500">✕</button>
              </div>
              <form onSubmit={handleSaveApiKey} className="flex gap-1.5">
                <input 
                  type="password"
                  value={apiKeyInput}
                  onChange={(e) => setApiKeyInput(e.target.value)}
                  placeholder="Dán AIzaSy... (Để trống nếu dùng Fallback)"
                  className="flex-1 px-2.5 py-1 text-xs border border-amber-300 rounded-lg outline-none bg-white font-mono"
                />
                <Button type="submit" size="sm" className="bg-neutral-950 text-white text-[11px] px-3 rounded-lg">
                  Lưu
                </Button>
              </form>
            </div>
          )}

          {/* Danh sách tin nhắn */}
          <div className="flex-1 p-4 overflow-y-auto space-y-3.5 bg-neutral-50/50">
            {messages.map((msg) => (
              <div 
                key={msg.id} 
                className={`flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}
              >
                <div 
                  className={`max-w-[85%] rounded-2xl px-3.5 py-2.5 text-xs sm:text-[13px] leading-relaxed shadow-2xs ${
                    msg.sender === 'user' 
                      ? 'bg-neutral-950 text-white rounded-tr-none' 
                      : 'bg-white text-neutral-800 border border-neutral-200/80 rounded-tl-none whitespace-pre-line'
                  }`}
                >
                  {msg.text}
                </div>

                {/* Sản phẩm gợi ý đính kèm */}
                {msg.suggestedItem && (
                  <div 
                    onClick={() => onSelectProduct && onSelectProduct(msg.suggestedItem)}
                    className="mt-2 w-64 bg-white p-2.5 rounded-xl border border-amber-200/80 shadow-md flex gap-2.5 cursor-pointer hover:border-amber-500 transition group"
                  >
                    <img 
                      src={msg.suggestedItem.images?.[0] || msg.suggestedItem.image} 
                      alt={msg.suggestedItem.name} 
                      className="w-12 h-14 object-cover rounded-lg shrink-0 border border-neutral-100"
                    />
                    <div className="min-w-0 flex-1">
                      <span className="text-[9px] font-bold text-amber-700 bg-amber-50 px-1 py-0.5 rounded">
                        Đề xuất
                      </span>
                      <h4 className="text-[11px] font-bold text-neutral-900 truncate mt-0.5 group-hover:text-amber-600 transition">
                        {msg.suggestedItem.name}
                      </h4>
                      <div className="flex items-center justify-between mt-1">
                        <span className="text-xs font-black text-neutral-950">
                          {new Intl.NumberFormat('vi-VN').format(msg.suggestedItem.price)}đ
                        </span>
                        <span className="text-[10px] text-amber-600 font-bold group-hover:underline">
                          Xem chi tiết →
                        </span>
                      </div>
                    </div>
                  </div>
                )}

                <span className="text-[10px] text-neutral-400 mt-1 px-1">
                  {msg.time}
                </span>
              </div>
            ))}

            {loading && (
              <div className="flex items-center gap-2 text-xs text-neutral-500 bg-white p-2.5 rounded-2xl border border-neutral-200 w-fit">
                <Loader2 className="w-3.5 h-3.5 animate-spin text-amber-500" />
                <span>AI Stylist đang soạn câu trả lời...</span>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Câu hỏi gợi ý nhanh */}
          <div className="px-3 py-2 bg-white border-t border-neutral-100 flex gap-1.5 overflow-x-auto scrollbar-none">
            {quickQuestions.map((q, idx) => (
              <button
                key={idx}
                onClick={() => handleSend(q)}
                disabled={loading}
                className="text-[11px] text-neutral-600 hover:text-neutral-950 bg-neutral-100 hover:bg-amber-50 px-2.5 py-1 rounded-full whitespace-nowrap transition border border-neutral-200/60 shrink-0 cursor-pointer"
              >
                {q}
              </button>
            ))}
          </div>

          {/* Ô nhập tin nhắn */}
          <form 
            onSubmit={(e) => { e.preventDefault(); handleSend(); }} 
            className="p-3 bg-white border-t border-neutral-200 flex items-center gap-2"
          >
            <input 
              type="text" 
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder="Hỏi Stylist AI về cách phối đồ, chọn size..." 
              className="flex-1 bg-neutral-100 text-xs sm:text-sm px-3.5 py-2.5 rounded-xl outline-none focus:ring-1 focus:ring-neutral-950 focus:bg-white transition"
            />
            <button 
              type="submit" 
              disabled={loading || !inputValue.trim()}
              className="w-10 h-10 rounded-xl bg-neutral-950 hover:bg-neutral-800 disabled:opacity-40 text-white flex items-center justify-center transition shrink-0 cursor-pointer"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>
      )}

      {/* Nút bấm tròn mở Chatbot với Badge AI */}
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="w-14 h-14 rounded-full bg-gradient-to-tr from-neutral-950 via-neutral-900 to-amber-950 text-white flex items-center justify-center shadow-xl hover:scale-105 transition-all cursor-pointer border border-amber-500/40 relative group"
        aria-label="Mở Trợ lý AI Stylist"
      >
        <span className="absolute -top-1 -right-1 bg-gradient-to-r from-amber-400 to-amber-500 text-neutral-950 text-[9px] font-black px-1.5 py-0.5 rounded-full border border-neutral-900 shadow animate-pulse">
          AI
        </span>
        {isOpen ? <X className="w-6 h-6" /> : <MessageSquare className="w-6 h-6 text-amber-400" />}
      </button>
    </div>
  );
};
