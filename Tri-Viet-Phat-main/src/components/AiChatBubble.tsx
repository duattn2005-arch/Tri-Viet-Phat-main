import React, { useState, useEffect, useRef } from 'react';
import { COMPANY_INFO } from '../data/mockData';

interface ChatMessage {
  id: string;
  sender: 'user' | 'assistant';
  text: string;
  timestamp: string;
}

interface AiChatBubbleProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenConsultation?: (prodName?: string) => void;
}

const INITIAL_MESSAGES: ChatMessage[] = [
  {
    id: 'welcome-1',
    sender: 'assistant',
    text: `Kính chào Quý khách! Tôi là **Trợ lý AI Trí Việt Phát** - chuyên gia tư vấn kỹ thuật y sinh và trang thiết bị xét nghiệm y khoa.\n\nTôi có thể hỗ trợ Quý khách giải đáp:\n- Thông số kỹ thuật các dòng máy xét nghiệm (sinh hóa, huyết học, nước tiểu, điện giải, miễn dịch, đông máu...)\n- Bộ hóa chất xét nghiệm Dewei chính hãng\n- Quy trình bảo hành, hiệu chuẩn thiết bị\n- Báo giá và giải pháp tối ưu cho phòng khám & bệnh viện`,
    timestamp: 'Vừa xong',
  },
];

const SUGGESTIONS = [
  'Tư vấn máy điện giải AC9803',
  'Báo giá hóa chất huyết học Dewei',
  'Thông số máy nước tiểu H-1600',
  'Máy xét nghiệm HbA1c Quo-Test',
  'Địa chỉ và hotline công ty',
];

export const AiChatBubble: React.FC<AiChatBubbleProps> = ({
  isOpen,
  onClose,
  onOpenConsultation,
}) => {
  const [messages, setMessages] = useState<ChatMessage[]>(INITIAL_MESSAGES);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement | null>(null);
  const inputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => {
        inputRef.current?.focus();
        scrollToBottom();
      }, 150);
    }
  }, [isOpen]);

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
    }
  }, [messages, isLoading]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const getCurrentTime = () => {
    const now = new Date();
    return `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
  };

  const handleSendMessage = async (textToSend?: string) => {
    const messageContent = (textToSend || inputValue).trim();
    if (!messageContent || isLoading) return;

    const userMsg: ChatMessage = {
      id: `user-${Date.now()}`,
      sender: 'user',
      text: messageContent,
      timestamp: getCurrentTime(),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputValue('');
    setIsLoading(true);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: messageContent,
          history: messages.slice(-6).map((m) => ({
            sender: m.sender,
            text: m.text,
          })),
        }),
      });

      const data = await response.json();
      const replyText =
        data.reply ||
        data.fallback ||
        `Cảm ơn Quý khách! Quý khách vui lòng liên hệ Hotline ${COMPANY_INFO.hotline} để được chuyên viên kỹ thuật giải đáp chi tiết nhất.`;

      const aiMsg: ChatMessage = {
        id: `ai-${Date.now()}`,
        sender: 'assistant',
        text: replyText,
        timestamp: getCurrentTime(),
      };

      setMessages((prev) => [...prev, aiMsg]);
    } catch (error) {
      console.error('Chat error:', error);
      const errorMsg: ChatMessage = {
        id: `ai-${Date.now()}`,
        sender: 'assistant',
        text: `Hiện tại hệ thống tư vấn trực tuyến đang bảo trì kết nối. Quý khách vui lòng gọi trực tiếp Hotline **${COMPANY_INFO.hotline}** để gặp kỹ sư tư vấn ngay lập tức ạ!`,
        timestamp: getCurrentTime(),
      };
      setMessages((prev) => [...prev, errorMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const cleanMedicalFormulas = (raw: string): string => {
    if (!raw) return '';
    let str = raw;

    // Replace exact common medical ion LaTeX strings
    str = str.replace(/\$Na\^\{\+?\}\$|\$Na\^\+\$/gi, 'Na⁺');
    str = str.replace(/\$K\^\{\+?\}\$|\$K\^\+\$/gi, 'K⁺');
    str = str.replace(/\$Cl\^\{\-?\}\$|\$Cl\^\-\$/gi, 'Cl⁻');
    str = str.replace(/\$Ca\^\{\+\+\}\$|\$Ca\^\{2\+\}\$|\$Ca\^\+\+\$|\$Ca\^2\+\$/gi, 'Ca²⁺');
    str = str.replace(/\$Li\^\{\+?\}\$|\$Li\^\+\$/gi, 'Li⁺');
    str = str.replace(/\$Mg\^\{2\+\}\$|\$Mg\^\{\+\+\}\$|\$Mg\^2\+\$/gi, 'Mg²⁺');
    str = str.replace(/\$pH\$/gi, 'pH');
    str = str.replace(/\$HCO_3\^-\$|\$HCO_3\^\{\-\}\$/gi, 'HCO₃⁻');

    // Generic LaTeX math tokens enclosed in $...$
    str = str.replace(/\$([^$]+)\$/g, (_, inner) => {
      return inner
        .replace(/\\text\{([^}]+)\}/g, '$1')
        .replace(/\\mathrm\{([^}]+)\}/g, '$1')
        .replace(/\\times/g, '×')
        .replace(/\\pm/g, '±')
        .replace(/\\le(q)?/g, '≤')
        .replace(/\\ge(q)?/g, '≥')
        .replace(/\\mu/g, 'µ')
        .replace(/\^\{\+\+\}/g, '²⁺')
        .replace(/\^\{2\+\}/g, '²⁺')
        .replace(/\^\{\+\}/g, '⁺')
        .replace(/\^\{\-\}/g, '⁻')
        .replace(/\^\+/g, '⁺')
        .replace(/\^\-/g, '⁻')
        .replace(/\^2/g, '²')
        .replace(/\^3/g, '³')
        .replace(/\_2/g, '₂')
        .replace(/\_3/g, '₃')
        .replace(/\_4/g, '₄')
        .replace(/\{|\}/g, '');
    });

    // Standalone superscripts outside $
    str = str.replace(/Na\^\+/g, 'Na⁺');
    str = str.replace(/K\^\+/g, 'K⁺');
    str = str.replace(/Cl\^\-/g, 'Cl⁻');
    str = str.replace(/Ca\^(\+\+|2\+)/g, 'Ca²⁺');
    str = str.replace(/Li\^\+/g, 'Li⁺');

    return str;
  };

  const renderInlineFormatted = (content: string) => {
    // Splits by **bold** or *italic*
    const tokens = content.split(/(\*\*.*?\*\*|\*[^*\n]+?\*)/g);
    return tokens.map((tok, tIdx) => {
      if (tok.startsWith('**') && tok.endsWith('**') && tok.length >= 4) {
        return (
          <strong key={tIdx} className="font-bold text-[#006194]">
            {tok.slice(2, -2)}
          </strong>
        );
      }
      if (tok.startsWith('*') && tok.endsWith('*') && tok.length >= 2 && !tok.startsWith('**')) {
        return (
          <em key={tIdx} className="italic text-[#1e293b]">
            {tok.slice(1, -1)}
          </em>
        );
      }
      return <span key={tIdx}>{tok}</span>;
    });
  };

  const renderFormattedText = (text: string) => {
    const cleaned = cleanMedicalFormulas(text);
    const lines = cleaned.split('\n');

    return lines.map((line, idx) => {
      const trimmed = line.trim();
      if (!trimmed) {
        return <p key={idx} className="h-1.5" />;
      }

      // Check if line is a bullet item: starts with "* ", "- ", "• "
      const bulletMatch = trimmed.match(/^(\*|-|•)\s+(.*)$/);
      if (bulletMatch) {
        const itemContent = bulletMatch[2];
        return (
          <div key={idx} className="flex items-start gap-1.5 pl-0.5 my-1 text-[13px] leading-relaxed">
            <span className="text-[#006194] font-bold shrink-0 mt-0.5">•</span>
            <div className="flex-1">{renderInlineFormatted(itemContent)}</div>
          </div>
        );
      }

      return (
        <p key={idx} className="min-h-[1.2em] my-1 text-[13px] leading-relaxed">
          {renderInlineFormatted(trimmed)}
        </p>
      );
    });
  };

  return (
    <>
      {/* Floating Chat Dialog Window */}
      {isOpen && (
        <div
          className="fixed bottom-6 right-4 sm:right-6 z-50 w-[94vw] sm:w-[440px] md:w-[450px] h-[600px] max-h-[88vh] bg-white rounded-3xl shadow-[0_20px_60px_rgba(0,0,0,0.25)] border border-[#bae6fd]/80 flex flex-col overflow-hidden animate-in fade-in slide-in-from-bottom-5 duration-200"
          role="dialog"
          aria-label="Cửa sổ Trợ lý AI & Liên hệ Trí Việt Phát"
        >
          {/* Chat Header */}
          <div className="bg-linear-to-r from-[#006194] to-[#0284c7] px-4 sm:px-5 py-3.5 text-white flex items-center justify-between shadow-md shrink-0">
            <div className="flex items-center gap-3">
              <div className="relative w-10 h-10 rounded-full bg-white/20 backdrop-blur flex items-center justify-center border border-white/40">
                <span className="material-symbols-outlined text-white text-[24px]">smart_toy</span>
                <span className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-[#10b981] border-2 border-[#006194]"></span>
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <h3 className="text-[14.5px] font-bold leading-tight tracking-wide">
                    Trợ Lý AI Trí Việt Phát
                  </h3>
                  <span className="material-symbols-outlined text-[15px] text-[#38bdf8]" title="Đã chứng thực">
                    verified
                  </span>
                </div>
                <p className="text-[11.5px] text-[#e0f2fe] flex items-center gap-1 opacity-90">
                  <span>Kỹ sư y sinh AI</span>
                  <span>•</span>
                  <span className="text-[#86efac] font-semibold">Trực tuyến 24/7</span>
                </p>
              </div>
            </div>

            <div className="flex items-center gap-1">
              <button
                onClick={() => setMessages(INITIAL_MESSAGES)}
                title="Làm mới cuộc trò chuyện"
                className="w-8 h-8 rounded-full text-white/80 hover:text-white hover:bg-white/15 flex items-center justify-center transition-colors cursor-pointer"
              >
                <span className="material-symbols-outlined text-[19px]">refresh</span>
              </button>
              <button
                onClick={onClose}
                title="Đóng chat"
                className="w-8 h-8 rounded-full text-white/80 hover:text-white hover:bg-white/15 flex items-center justify-center transition-colors cursor-pointer"
              >
                <span className="material-symbols-outlined text-[20px]">close</span>
              </button>
            </div>
          </div>

          {/* Messages Body */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3.5 bg-[#f8fafc]">
            {messages.map((msg) => {
              const isUser = msg.sender === 'user';
              return (
                <div
                  key={msg.id}
                  className={`flex gap-2.5 max-w-[88%] ${isUser ? 'ml-auto flex-row-reverse' : 'mr-auto'}`}
                >
                  {!isUser && (
                    <div className="w-7 h-7 rounded-full bg-[#006194] text-white flex items-center justify-center shrink-0 text-[14px] mt-0.5 shadow-sm">
                      <span className="material-symbols-outlined text-[16px]">smart_toy</span>
                    </div>
                  )}
                  <div>
                    <div
                      className={`px-3.5 py-2.5 rounded-2xl text-[13px] leading-relaxed shadow-xs ${
                        isUser
                          ? 'bg-[#006194] text-white rounded-br-xs'
                          : 'bg-white text-[#1e293b] border border-[#e2e8f0] rounded-bl-xs'
                      }`}
                    >
                      {isUser ? msg.text : renderFormattedText(msg.text)}
                    </div>
                    <span
                      className={`block text-[10px] text-[#94a3b8] mt-1 ${
                        isUser ? 'text-right' : 'text-left'
                      }`}
                    >
                      {msg.timestamp}
                    </span>
                  </div>
                </div>
              );
            })}

            {/* AI Typing Indicator */}
            {isLoading && (
              <div className="flex gap-2.5 max-w-[85%] mr-auto items-center">
                <div className="w-7 h-7 rounded-full bg-[#006194] text-white flex items-center justify-center shrink-0 text-[14px]">
                  <span className="material-symbols-outlined text-[16px]">smart_toy</span>
                </div>
                <div className="bg-white border border-[#e2e8f0] px-4 py-3 rounded-2xl rounded-bl-xs shadow-xs flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-[#006194] animate-bounce"></span>
                  <span
                    className="w-2 h-2 rounded-full bg-[#0284c7] animate-bounce"
                    style={{ animationDelay: '0.15s' }}
                  ></span>
                  <span
                    className="w-2 h-2 rounded-full bg-[#38bdf8] animate-bounce"
                    style={{ animationDelay: '0.3s' }}
                  ></span>
                  <span className="text-[11px] text-[#64748b] ml-1.5">Kỹ sư AI đang soạn trả lời...</span>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Quick Suggestion Chips */}
          <div className="px-3 py-2 bg-white border-t border-[#f1f5f9] flex items-center gap-1.5 overflow-x-auto no-scrollbar shrink-0">
            <span className="text-[11px] font-bold text-[#64748b] shrink-0 flex items-center gap-0.5">
              <span className="material-symbols-outlined text-[14px]">bolt</span>
              Gợi ý:
            </span>
            {SUGGESTIONS.map((sug, i) => (
              <button
                key={i}
                disabled={isLoading}
                onClick={() => handleSendMessage(sug)}
                className="text-[11.5px] px-2.5 py-1 rounded-full bg-[#f1f5f9] hover:bg-[#e0f2fe] text-[#334155] hover:text-[#006194] transition-colors whitespace-nowrap shrink-0 border border-transparent hover:border-[#bae6fd] cursor-pointer disabled:opacity-50"
              >
                {sug}
              </button>
            ))}
          </div>

          {/* Chat Input Bar */}
          <div className="p-3 bg-white border-t border-[#e2e8f0] shrink-0">
            <div className="flex items-center gap-2 bg-[#f8fafc] rounded-2xl border border-[#e2e8f0] focus-within:border-[#006194] focus-within:ring-2 focus-within:ring-[#006194]/20 px-3 py-1.5 transition-all">
              <input
                ref={inputRef}
                type="text"
                disabled={isLoading}
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Nhập câu hỏi kỹ thuật, thiết bị cần tư vấn..."
                className="flex-1 bg-transparent text-[13px] text-[#0f172a] placeholder-[#94a3b8] focus:outline-none py-1.5 disabled:opacity-60"
              />

              {onOpenConsultation && (
                <button
                  type="button"
                  onClick={() => {
                    onClose();
                    onOpenConsultation();
                  }}
                  title="Mở biểu mẫu báo giá chính thức"
                  className="text-[#64748b] hover:text-[#006194] p-1 rounded-lg transition-colors cursor-pointer"
                >
                  <span className="material-symbols-outlined text-[19px]">assignment</span>
                </button>
              )}

              <button
                type="button"
                disabled={!inputValue.trim() || isLoading}
                onClick={() => handleSendMessage()}
                className="w-8 h-8 rounded-xl bg-[#006194] hover:bg-[#0284c7] disabled:bg-[#cbd5e1] text-white flex items-center justify-center transition-colors shadow-xs cursor-pointer disabled:cursor-not-allowed shrink-0"
              >
                <span className="material-symbols-outlined text-[18px]">send</span>
              </button>
            </div>
            <div className="mt-1.5 flex items-center justify-end text-[11px] text-[#94a3b8] px-1">
              <a
                href={COMPANY_INFO.zaloUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-[#006194] hover:underline flex items-center gap-1"
              >
                <span className="material-symbols-outlined text-[13px]">chat</span>
                Chat Zalo trực tiếp
              </a>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
