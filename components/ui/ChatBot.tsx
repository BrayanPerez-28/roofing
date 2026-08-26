'use client';

/**
 * components/ui/ChatBot.tsx
 *
 * Floating AI chatbot widget for Perez Premium Roofing.
 * - Matches the dark glassmorphism design system.
 * - Opens/closes with a smooth Framer Motion animation.
 * - Messages stream in with a typing indicator.
 * - Fully responsive: full-screen on mobile, floating panel on desktop.
 * - Calls POST /api/public/chat on the Laravel backend.
 */

import { useState, useRef, useEffect, useCallback } from 'react';
import { motion, AnimatePresence, type Variants } from 'framer-motion';
import { sendChatMessage } from '@/services/api';

// ─── Types ────────────────────────────────────────────────────────────────────

type Role = 'user' | 'assistant' | 'system';

interface Message {
  id: string;
  role: Role;
  content: string;
}

// ─── Animation Variants ───────────────────────────────────────────────────────

const panelVariants: Variants = {
  hidden: {
    opacity: 0,
    scale: 0.88,
    y: 24,
  },
  visible: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: { type: 'spring', stiffness: 320, damping: 28 },
  },
  exit: {
    opacity: 0,
    scale: 0.88,
    y: 24,
    transition: { duration: 0.2, ease: 'easeIn' },
  },
};

const fabVariants: Variants = {
  rest: { scale: 1 },
  hover: { scale: 1.1 },
  tap: { scale: 0.95 },
};

const messageVariants: Variants = {
  hidden: { opacity: 0, y: 10 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.3, ease: 'easeOut' } },
};

// ─── Typing Indicator ────────────────────────────────────────────────────────

function TypingIndicator() {
  return (
    <motion.div
      className="flex items-end gap-2"
      initial="hidden"
      animate="visible"
      variants={messageVariants}
    >
      <div
        className="flex items-center justify-center w-7 h-7 rounded-full flex-shrink-0"
        style={{
          background: 'linear-gradient(135deg, #0b1e5b 0%, #1b2b68 100%)',
          border: '1px solid rgba(183,196,255,0.3)',
        }}
      >
        <span style={{ fontSize: 12 }}>🏠</span>
      </div>
      <div
        className="flex items-center gap-1 px-4 py-3 rounded-2xl rounded-bl-sm"
        style={{
          background: 'rgba(255,255,255,0.06)',
          border: '1px solid rgba(255,255,255,0.1)',
        }}
      >
        {[0, 1, 2].map((i) => (
          <span
            key={i}
            className="block w-1.5 h-1.5 rounded-full"
            style={{
              background: '#b7c4ff',
              animation: `chatDot 1.2s ease-in-out ${i * 0.2}s infinite`,
            }}
          />
        ))}
      </div>
    </motion.div>
  );
}

// ─── Quick Suggestion Pills ───────────────────────────────────────────────────

const SUGGESTIONS = [
  'What roofing services do you offer?',
  'How much does a roof repair cost?',
  '¿Cuánto cuesta un techo nuevo?',
  'Do you do free estimates?',
];

// ─── Main ChatBot Component ───────────────────────────────────────────────────

export default function ChatBot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'welcome',
      role: 'assistant',
      content:
        "Hi! 👋 I'm the Perez Roofing virtual assistant. Ask me anything about our roofing services, or I can help you get a **free estimate**!",
    },
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [hasUnread, setHasUnread] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const chatBodyRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom when messages change
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  // Focus input when panel opens
  useEffect(() => {
    if (isOpen) {
      setHasUnread(false);
      setTimeout(() => inputRef.current?.focus(), 300);
    }
  }, [isOpen]);

  // Show unread badge after 4s if chat is closed
  useEffect(() => {
    const timer = setTimeout(() => {
      if (!isOpen) setHasUnread(true);
    }, 4000);
    return () => clearTimeout(timer);
  }, [isOpen]);

  const sendMessage = useCallback(
    async (text: string) => {
      const trimmed = text.trim();
      if (!trimmed || isLoading) return;

      const userMsg: Message = {
        id: `user-${Date.now()}`,
        role: 'user',
        content: trimmed,
      };

      setMessages((prev) => [...prev, userMsg]);
      setInput('');
      setIsLoading(true);

      try {
        const data = await sendChatMessage(trimmed);
        const assistantMsg: Message = {
          id: `assistant-${Date.now()}`,
          role: 'assistant',
          content: data.reply,
        };
        setMessages((prev) => [...prev, assistantMsg]);
      } catch {
        setMessages((prev) => [
          ...prev,
          {
            id: `error-${Date.now()}`,
            role: 'assistant',
            content:
              "I'm having a bit of trouble connecting right now. Please use our **Contact form** to reach us directly — we respond fast! 🔧",
          },
        ]);
      } finally {
        setIsLoading(false);
      }
    },
    [isLoading]
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    sendMessage(input);
  };

  const handleSuggestion = (text: string) => {
    sendMessage(text);
  };

  const renderContent = (content: string) => {
    // Simple markdown-ish rendering for **bold**
    return content.split(/\*\*(.*?)\*\*/g).map((part, i) =>
      i % 2 === 1 ? (
        <strong key={i} style={{ color: '#b7c4ff' }}>
          {part}
        </strong>
      ) : (
        part
      )
    );
  };

  return (
    <>
      {/* ── Keyframe for typing dots ── */}
      <style>{`
        @keyframes chatDot {
          0%, 80%, 100% { transform: scale(0.7); opacity: 0.4; }
          40% { transform: scale(1); opacity: 1; }
        }
        @keyframes chatPulse {
          0%, 100% { box-shadow: 0 0 0 0 rgba(183,196,255,0.4); }
          50% { box-shadow: 0 0 0 10px rgba(183,196,255,0); }
        }
        .chat-fab-pulse { animation: chatPulse 2.5s ease-in-out infinite; }
      `}</style>

      {/* ── Chat Panel ── */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            key="chat-panel"
            variants={panelVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="fixed z-[9999] flex flex-col"
            style={{
              // Mobile: full-screen overlay
              bottom: 0,
              right: 0,
              left: 0,
              top: 0,
              // Override on md+ to floating panel
            }}
          >
            {/* Responsive wrapper */}
            <div
              className="
                relative flex flex-col w-full h-full
                md:absolute md:bottom-0 md:right-0 md:top-auto md:left-auto
                md:w-[400px] md:h-[560px] md:rounded-2xl overflow-hidden
              "
              style={{
                background: 'rgba(13, 14, 22, 0.97)',
                backdropFilter: 'blur(32px)',
                WebkitBackdropFilter: 'blur(32px)',
                border: '1px solid rgba(183,196,255,0.15)',
                boxShadow:
                  '0 30px 80px rgba(0,0,0,0.8), 0 0 40px rgba(183,196,255,0.08)',
              }}
            >
              {/* ── Header ── */}
              <div
                className="flex items-center justify-between px-4 py-3 flex-shrink-0"
                style={{
                  background:
                    'linear-gradient(135deg, rgba(11,30,91,0.9) 0%, rgba(5,85,247,0.2) 100%)',
                  borderBottom: '1px solid rgba(183,196,255,0.1)',
                }}
              >
                <div className="flex items-center gap-3">
                  <div
                    className="relative flex items-center justify-center w-10 h-10 rounded-xl"
                    style={{
                      background:
                        'linear-gradient(135deg, #b7c4ff 0%, #0555f7 100%)',
                      boxShadow: '0 0 16px rgba(183,196,255,0.4)',
                    }}
                  >
                    <span className="text-lg">🏠</span>
                    {/* Online dot */}
                    <span
                      className="absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full border-2"
                      style={{
                        background: '#22c55e',
                        borderColor: '#0d0e16',
                      }}
                    />
                  </div>
                  <div>
                    <p
                      className="font-semibold text-sm leading-tight"
                      style={{ color: '#e5e2e1', fontFamily: 'Montserrat, sans-serif' }}
                    >
                      Perez Roofing AI
                    </p>
                    <p className="text-xs" style={{ color: '#22c55e' }}>
                      Online · Typically replies instantly
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setIsOpen(false)}
                  className="flex items-center justify-center w-8 h-8 rounded-lg transition-all duration-200"
                  style={{ color: '#8f909b' }}
                  onMouseEnter={(e) => {
                    (e.currentTarget as HTMLButtonElement).style.background =
                      'rgba(255,255,255,0.08)';
                    (e.currentTarget as HTMLButtonElement).style.color = '#e5e2e1';
                  }}
                  onMouseLeave={(e) => {
                    (e.currentTarget as HTMLButtonElement).style.background = 'transparent';
                    (e.currentTarget as HTMLButtonElement).style.color = '#8f909b';
                  }}
                  aria-label="Close chat"
                >
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
                    <path d="M12.5 3.5l-9 9M3.5 3.5l9 9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" fill="none" />
                  </svg>
                </button>
              </div>

              {/* ── Messages Body ── */}
              <div
                ref={chatBodyRef}
                className="flex-1 overflow-y-auto px-4 py-4 space-y-4"
                style={{ scrollbarWidth: 'thin', scrollbarColor: '#454650 transparent' }}
              >
                <AnimatePresence initial={false}>
                  {messages.map((msg) => (
                    <motion.div
                      key={msg.id}
                      variants={messageVariants}
                      initial="hidden"
                      animate="visible"
                      className={`flex items-end gap-2 ${
                        msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'
                      }`}
                    >
                      {/* Avatar */}
                      {msg.role === 'assistant' && (
                        <div
                          className="flex items-center justify-center w-7 h-7 rounded-full flex-shrink-0"
                          style={{
                            background:
                              'linear-gradient(135deg, #0b1e5b 0%, #1b2b68 100%)',
                            border: '1px solid rgba(183,196,255,0.3)',
                          }}
                        >
                          <span style={{ fontSize: 12 }}>🏠</span>
                        </div>
                      )}
                      {/* Bubble */}
                      <div
                        className={`max-w-[78%] px-4 py-3 text-sm leading-relaxed ${
                          msg.role === 'user'
                            ? 'rounded-2xl rounded-br-sm'
                            : 'rounded-2xl rounded-bl-sm'
                        }`}
                        style={
                          msg.role === 'user'
                            ? {
                                background:
                                  'linear-gradient(135deg, #b7c4ff 0%, #dde1ff 100%)',
                                color: '#1b2b68',
                                fontWeight: 500,
                              }
                            : {
                                background: 'rgba(255,255,255,0.06)',
                                border: '1px solid rgba(255,255,255,0.08)',
                                color: '#e5e2e1',
                              }
                        }
                      >
                        {renderContent(msg.content)}
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>

                {/* Typing indicator */}
                {isLoading && <TypingIndicator />}

                <div ref={bottomRef} />
              </div>

              {/* ── Quick Suggestions ── (only show when just welcome message) */}
              {messages.length === 1 && !isLoading && (
                <div className="px-4 pb-2 flex flex-wrap gap-2">
                  {SUGGESTIONS.map((s) => (
                    <button
                      key={s}
                      onClick={() => handleSuggestion(s)}
                      className="text-xs px-3 py-1.5 rounded-full transition-all duration-200"
                      style={{
                        background: 'rgba(183,196,255,0.08)',
                        border: '1px solid rgba(183,196,255,0.2)',
                        color: '#b7c4ff',
                        fontFamily: 'Inter, sans-serif',
                      }}
                      onMouseEnter={(e) => {
                        (e.currentTarget as HTMLButtonElement).style.background =
                          'rgba(183,196,255,0.18)';
                        (e.currentTarget as HTMLButtonElement).style.borderColor =
                          'rgba(183,196,255,0.5)';
                      }}
                      onMouseLeave={(e) => {
                        (e.currentTarget as HTMLButtonElement).style.background =
                          'rgba(183,196,255,0.08)';
                        (e.currentTarget as HTMLButtonElement).style.borderColor =
                          'rgba(183,196,255,0.2)';
                      }}
                    >
                      {s}
                    </button>
                  ))}
                </div>
              )}

              {/* ── Input Bar ── */}
              <div
                className="flex-shrink-0 px-3 py-3"
                style={{ borderTop: '1px solid rgba(255,255,255,0.06)' }}
              >
                <form
                  onSubmit={handleSubmit}
                  className="flex items-center gap-2"
                >
                  <input
                    ref={inputRef}
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder="Type your question…"
                    disabled={isLoading}
                    maxLength={1000}
                    className="flex-1 px-4 py-2.5 rounded-xl text-sm outline-none transition-all duration-200"
                    style={{
                      background: 'rgba(255,255,255,0.05)',
                      border: '1px solid rgba(255,255,255,0.1)',
                      color: '#e5e2e1',
                      fontFamily: 'Inter, sans-serif',
                    }}
                    onFocus={(e) => {
                      e.currentTarget.style.borderColor = 'rgba(183,196,255,0.5)';
                      e.currentTarget.style.boxShadow =
                        '0 0 12px rgba(183,196,255,0.15)';
                      e.currentTarget.style.background = 'rgba(255,255,255,0.08)';
                    }}
                    onBlur={(e) => {
                      e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)';
                      e.currentTarget.style.boxShadow = 'none';
                      e.currentTarget.style.background = 'rgba(255,255,255,0.05)';
                    }}
                  />
                  <button
                    type="submit"
                    disabled={!input.trim() || isLoading}
                    className="flex items-center justify-center w-10 h-10 rounded-xl transition-all duration-200 flex-shrink-0"
                    style={{
                      background:
                        input.trim() && !isLoading
                          ? 'linear-gradient(135deg, #b7c4ff 0%, #0555f7 100%)'
                          : 'rgba(255,255,255,0.06)',
                      boxShadow:
                        input.trim() && !isLoading
                          ? '0 0 16px rgba(183,196,255,0.3)'
                          : 'none',
                      border: '1px solid rgba(255,255,255,0.1)',
                      cursor: input.trim() && !isLoading ? 'pointer' : 'not-allowed',
                    }}
                    aria-label="Send message"
                  >
                    <svg
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke={input.trim() && !isLoading ? '#1b2b68' : '#454650'}
                      strokeWidth="2.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <line x1="22" y1="2" x2="11" y2="13" />
                      <polygon points="22 2 15 22 11 13 2 9 22 2" />
                    </svg>
                  </button>
                </form>
                <p
                  className="text-center text-xs mt-2"
                  style={{ color: '#454650', fontFamily: 'Inter, sans-serif' }}
                >
                  Powered by AI · Perez Roofing
                </p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Floating Action Button ── */}
      <motion.button
        id="chat-fab"
        variants={fabVariants}
        initial="rest"
        whileHover="hover"
        whileTap="tap"
        onClick={() => setIsOpen((v) => !v)}
        className={`fixed bottom-6 right-6 z-[9998] flex items-center justify-center w-14 h-14 rounded-full shadow-2xl ${
          !isOpen ? 'chat-fab-pulse' : ''
        }`}
        style={{
          background: isOpen
            ? 'rgba(20,22,35,0.95)'
            : 'linear-gradient(135deg, #b7c4ff 0%, #0555f7 100%)',
          border: '2px solid rgba(183,196,255,0.3)',
          boxShadow: isOpen
            ? '0 8px 32px rgba(0,0,0,0.6)'
            : '0 8px 32px rgba(5,85,247,0.4)',
        }}
        aria-label={isOpen ? 'Close chat' : 'Open chat assistant'}
        aria-expanded={isOpen}
      >
        <AnimatePresence mode="wait">
          {isOpen ? (
            <motion.span
              key="close"
              initial={{ rotate: -90, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: 90, opacity: 0 }}
              transition={{ duration: 0.15 }}
            >
              <svg
                width="20"
                height="20"
                viewBox="0 0 20 20"
                fill="none"
                stroke="#b7c4ff"
                strokeWidth="2"
                strokeLinecap="round"
              >
                <path d="M15 5L5 15M5 5l10 10" />
              </svg>
            </motion.span>
          ) : (
            <motion.span
              key="chat"
              initial={{ rotate: 90, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: -90, opacity: 0 }}
              transition={{ duration: 0.15 }}
            >
              <svg
                width="22"
                height="22"
                viewBox="0 0 24 24"
                fill="none"
                stroke="#1b2b68"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
              </svg>
            </motion.span>
          )}
        </AnimatePresence>

        {/* Unread badge */}
        <AnimatePresence>
          {hasUnread && !isOpen && (
            <motion.span
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0 }}
              className="absolute -top-1 -right-1 flex items-center justify-center w-5 h-5 rounded-full text-xs font-bold"
              style={{
                background: '#0555f7',
                color: '#fff',
                border: '2px solid #131313',
                fontFamily: 'Montserrat, sans-serif',
                fontSize: 10,
              }}
            >
              1
            </motion.span>
          )}
        </AnimatePresence>
      </motion.button>
    </>
  );
}
