import React, { useState, useRef, useEffect } from 'react';
import { 
  X, 
  Send, 
  Bot, 
  Sparkles, 
  Loader2, 
  Key, 
  Phone, 
  ArrowUp,
  MessageCircle
} from 'lucide-react';
import { Button } from '../common/Button';
import { generateStylistChatReply, getGeminiApiKey, setGeminiApiKey } from '../../services/geminiService';

export const ChatbotWidget = ({ products = [], onSelectProduct }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isWidgetExpanded, setIsWidgetExpanded] = useState(true); // Mở/đóng cụm nút liên hệ
  const [showScrollTop, setShowScrollTop] = useState(false);
  
  const [messages, setMessages] = useState([
    {
      id: 1,
      sender: 'bot',
      text: 'Xin chào quý ông! Tôi là Stylist AI của MENSTYLE (tích hợp Gemini AI 2.5). Quý khách cần tư vấn chọn size, phối outfit đi làm, dạ tiệc hay dạo phố hôm nay?',
      time: 'Vừa xong'
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [loading, setLoading] = useState(false);
  const [showKeyModal, setShowKeyModal] = useState(false);
  const [apiKeyInput, setApiKeyInput] = useState(getGeminiApiKey());
  const messagesEndRef = useRef(null);

  // Theo dõi cuộn trang để hiện nút Back to top
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 300) {
        setShowScrollTop(true);
      } else {
        setShowScrollTop(false);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

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
    <div className="fixed bottom-6 right-5 sm:right-6 z-50 flex flex-col items-end gap-2.5">
      {/* Cửa sổ Chat Popup AI */}
      {isOpen && (
        <div className="w-[92vw] sm:w-[400px] bg-white rounded-3xl shadow-2xl border border-neutral-200 overflow-hidden flex flex-col h-[520px] mb-2 animate-in slide-in-from-bottom-5 duration-300">
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

      {/* ================= CỤM NÚT TRÒN NỔI Ở GÓC THEO ĐÚNG ẢNH MẪU ================= */}
      <div className="flex flex-col items-center gap-2.5 select-none">
        {isWidgetExpanded && (
          <div className="flex flex-col items-center gap-2.5 animate-in slide-in-from-bottom-3 duration-200">
            {/* 1. Nút Chat AI Stylist (Đặc quyền nổi bật với huy hiệu AI) */}
            <button
              onClick={() => setIsOpen(!isOpen)}
              className={`w-11 h-11 rounded-full flex items-center justify-center shadow-lg transition-transform hover:scale-110 cursor-pointer relative ${
                isOpen 
                  ? 'bg-amber-500 text-neutral-950 ring-2 ring-neutral-950' 
                  : 'bg-gradient-to-tr from-neutral-950 to-neutral-800 text-amber-400 border border-amber-500/50'
              }`}
              title="Trò chuyện cùng AI Stylist"
            >
              <span className="absolute -top-1 -right-1 bg-amber-500 text-neutral-950 text-[8px] font-black px-1 rounded-full shadow">
                AI
              </span>
              <Bot className="w-5 h-5" />
            </button>

            {/* 2. Nút Gọi Điện Hotline (Màu xanh lá tròn - Icon điện thoại chuẩn ảnh) */}
            <a 
              href="tel:19006868"
              className="w-11 h-11 rounded-full bg-[#276749] hover:bg-[#1f5139] text-white flex items-center justify-center shadow-lg transition-transform hover:scale-110 cursor-pointer"
              title="Gọi Hotline tư vấn 1900 6868"
            >
              <Phone className="w-5 h-5" />
            </a>

            {/* 3. Nút Messenger Facebook (Màu xanh dương tròn - Icon Messenger chuẩn ảnh) */}
            <a 
              href="https://m.me/menstyle"
              target="_blank"
              rel="noreferrer"
              className="w-11 h-11 rounded-full bg-[#0084ff] hover:bg-[#0073e6] text-white flex items-center justify-center shadow-lg transition-transform hover:scale-110 cursor-pointer"
              title="Chat qua Facebook Messenger"
            >
              {/* SVG Messenger chính xác */}
              <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                <path d="M12 2C6.48 2 2 6.03 2 11c0 2.87 1.5 5.43 3.86 7.02V21l2.84-1.56C9.74 19.8 10.84 20 12 20c5.52 0 10-4.03 10-9s-4.48-9-10-9zm1.06 12.15l-2.58-2.75-5.04 2.75 5.54-5.89 2.65 2.75 4.97-2.75-5.54 5.89z"/>
              </svg>
            </a>

            {/* 4. Nút Zalo Chat (Màu xanh biển đậm với chữ Zalo đậm chuẩn ảnh) */}
            <a 
              href="https://zalo.me/0988776655"
              target="_blank"
              rel="noreferrer"
              className="w-11 h-11 rounded-full bg-[#0068ff] hover:bg-[#0057d6] text-white flex items-center justify-center font-black text-xs shadow-lg transition-transform hover:scale-110 cursor-pointer tracking-tighter"
              title="Chat qua Zalo: 0988 776 655"
            >
              Zalo
            </a>
          </div>
        )}

        {/* 5. Nút Đóng / Mở menu liên hệ (Nút tròn màu đen có icon X / Message) */}
        <button
          onClick={() => setIsWidgetExpanded(!isWidgetExpanded)}
          className="w-11 h-11 rounded-full bg-[#18181b] hover:bg-neutral-800 text-white flex items-center justify-center shadow-xl transition-all cursor-pointer"
          title={isWidgetExpanded ? 'Thu gọn liên hệ' : 'Mở rộng liên hệ'}
        >
          {isWidgetExpanded ? <X className="w-5 h-5" /> : <MessageCircle className="w-5 h-5 text-amber-400" />}
        </button>

        {/* 6. Nút Cuộn Lên Đầu Trang (Back To Top - Tròn đen có mũi tên lên chuẩn ảnh) */}
        <button
          onClick={scrollToTop}
          className={`w-11 h-11 rounded-full bg-[#18181b] hover:bg-neutral-800 text-white flex items-center justify-center shadow-xl transition-all duration-300 cursor-pointer ${
            showScrollTop ? 'opacity-100 scale-100' : 'opacity-70 hover:opacity-100'
          }`}
          title="Cuộn lên đầu trang"
        >
          <ArrowUp className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
};
