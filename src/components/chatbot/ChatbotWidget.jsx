import React, { useState } from 'react';
import { 
  MessageSquare, 
  X, 
  Send, 
  Sparkles, 
  Bot, 
  User, 
  ChevronRight,
  Shirt,
  HelpCircle
} from 'lucide-react';

export const ChatbotWidget = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      id: 1,
      sender: 'bot',
      text: 'Xin chào quý ông! Tôi là Stylist AI từ MENSTYLE. Tôi có thể giúp gì cho bạn hôm nay (tư vấn chọn size, phối đồ Blazer hay chọn quà tặng)?',
      time: 'Vừa xong'
    }
  ]);
  const [inputValue, setInputValue] = useState('');

  // Quick prompt suggestions
  const suggestions = [
    'Tư vấn chọn size áo sơ mi',
    'Cách phối đồ Blazer đi tiệc',
    'Chính sách đổi trả hàng'
  ];

  const handleSend = (textToSend) => {
    const text = textToSend || inputValue;
    if (!text.trim()) return;

    const userMsg = {
      id: Date.now(),
      sender: 'user',
      text: text.trim(),
      time: 'Vừa xong'
    };

    setMessages(prev => [...prev, userMsg]);
    setInputValue('');

    // Giả lập bot phản hồi sau 600ms
    setTimeout(() => {
      let replyText = 'Cảm ơn quý ông đã liên hệ! Stylist MENSTYLE khuyên bạn nên chọn form Slim-fit vừa vặn tôn dáng. Bạn cao và nặng bao nhiêu kg để mình tư vấn size chuẩn nhất nhé?';
      if (text.toLowerCase().includes('đổi trả')) {
        replyText = 'MENSTYLE hỗ trợ đổi hàng miễn phí trong 30 ngày tận nơi. Shipper sẽ mang size mới đến và nhận lại sản phẩm cũ tại nhà cho bạn!';
      } else if (text.toLowerCase().includes('blazer') || text.toLowerCase().includes('tiệc')) {
        replyText = 'Với sự kiện hoặc tiệc tối, bạn nên phối Áo Blazer Italian Wool Đen cùng Sơ mi trắng Nano và Giày da Oxford để có vẻ ngoài lịch lãm, quyền lực nhất!';
      }

      setMessages(prev => [
        ...prev,
        {
          id: Date.now() + 1,
          sender: 'bot',
          text: replyText,
          time: 'Vừa xong'
        }
      ]);
    }, 600);
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end">
      {/* Cửa sổ Chat Popup */}
      {isOpen && (
        <div className="w-[92vw] sm:w-96 bg-white rounded-2xl shadow-2xl border border-neutral-200 overflow-hidden flex flex-col h-[500px] mb-4 animate-in slide-in-from-bottom-5 duration-300">
          {/* Header Chatbot */}
          <div className="bg-neutral-950 text-white p-4 flex items-center justify-between border-b border-neutral-800">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-full bg-amber-500 text-neutral-950 flex items-center justify-center font-black shadow-sm">
                <Bot className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-sm font-bold flex items-center gap-1.5">
                  Stylist AI MENSTYLE <Sparkles className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
                </h3>
                <p className="text-[10px] text-emerald-400 font-semibold flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping"></span>
                  Trợ lý thời trang trực tuyến
                </p>
              </div>
            </div>

            <button 
              onClick={() => setIsOpen(false)}
              className="p-1 rounded-lg text-neutral-400 hover:text-white hover:bg-neutral-800 transition"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Body tin nhắn */}
          <div className="flex-1 p-4 overflow-y-auto space-y-3 bg-neutral-50/50">
            {messages.map((m) => {
              const isBot = m.sender === 'bot';
              return (
                <div key={m.id} className={`flex gap-2 ${isBot ? 'items-start' : 'items-end justify-end'}`}>
                  {isBot && (
                    <div className="w-7 h-7 rounded-full bg-neutral-900 text-amber-400 flex items-center justify-center shrink-0 text-xs">
                      <Bot className="w-3.5 h-3.5" />
                    </div>
                  )}
                  <div className={`max-w-[80%] rounded-2xl p-3 text-xs leading-relaxed ${
                    isBot 
                      ? 'bg-white text-neutral-800 border border-neutral-200/80 shadow-2xs rounded-tl-none' 
                      : 'bg-neutral-950 text-white rounded-br-none shadow-sm'
                  }`}>
                    <p>{m.text}</p>
                    <span className={`text-[9px] block mt-1 ${isBot ? 'text-neutral-400' : 'text-neutral-400 text-right'}`}>
                      {m.time}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Gợi ý câu hỏi nhanh */}
          <div className="px-3 py-2 bg-white border-t border-neutral-100 flex gap-1.5 overflow-x-auto scrollbar-none">
            {suggestions.map((s, idx) => (
              <button
                key={idx}
                onClick={() => handleSend(s)}
                className="whitespace-nowrap bg-neutral-100 hover:bg-amber-50 hover:text-amber-800 text-[11px] font-medium text-neutral-700 px-2.5 py-1 rounded-full border border-neutral-200 transition"
              >
                {s}
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
              placeholder="Nhập câu hỏi cần tư vấn..."
              className="flex-1 bg-neutral-100 text-xs rounded-xl px-3 py-2.5 outline-none focus:ring-1 focus:ring-neutral-950"
            />
            <button
              type="submit"
              className="p-2.5 rounded-xl bg-neutral-950 hover:bg-amber-600 text-amber-400 hover:text-white transition shadow-sm"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>
      )}

      {/* Nút bấm nổi mở Chatbot */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-14 h-14 rounded-full bg-neutral-950 hover:bg-neutral-900 text-white shadow-2xl flex items-center justify-center relative transition-all duration-300 hover:scale-105 group border-2 border-amber-400/80"
        aria-label="Mở cửa sổ Chatbot"
      >
        {isOpen ? (
          <X className="w-6 h-6 text-amber-400" />
        ) : (
          <>
            <MessageSquare className="w-6 h-6 text-amber-400 group-hover:scale-110 transition" />
            <span className="absolute -top-1 -right-1 w-3.5 h-3.5 bg-amber-500 rounded-full border-2 border-white ring-2 ring-neutral-950" />
          </>
        )}
      </button>
    </div>
  );
};
