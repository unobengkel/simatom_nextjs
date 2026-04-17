'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { useDeepSeek } from './useDeepSeek';
import { useAtomStore } from '@/hooks/useAtomStore';
import type { ChatPanelConfig, ChatMessage } from '@/lib/atomTypes';

interface Props {
  panelConfig: ChatPanelConfig;
}

export default function ChatPanel({ panelConfig }: Props) {
  const { id, theme, isMain, initialContext } = panelConfig;

  const removePanel   = useAtomStore((s) => s.removeChatPanel);
  const updatePanel   = useAtomStore((s) => s.updateChatPanel);
  const bringToFront  = useAtomStore((s) => s.bringToFront);
  const addChatPanel  = useAtomStore((s) => s.addChatPanel);
  const setSettings   = useAtomStore((s) => s.setIsSettingsModalOpen);

  const { messages, isLoading, sendMessage, addAssistantMessage } = useDeepSeek(panelConfig.messages);

  const [inputVal, setInputVal]   = useState('');
  const [panelName, setPanelName] = useState(panelConfig.panelName);
  const [isEditing, setIsEditing] = useState(false);
  const [position, setPosition]   = useState(panelConfig.position);
  const [zIndex, setZIndex]       = useState(panelConfig.zIndex);

  const chatAreaRef  = useRef<HTMLDivElement>(null);
  const inputRef     = useRef<HTMLInputElement>(null);
  const panelRef     = useRef<HTMLDivElement>(null);
  const initialized  = useRef(false);

  const w = typeof window !== 'undefined' ? (window.innerWidth < 640 ? window.innerWidth * 0.9 : 380) : 380;
  const h = typeof window !== 'undefined' ? (window.innerWidth < 640 ? window.innerHeight * 0.8 : 500) : 500;

  // Pesan sambutan & pesan awal (branch context)
  useEffect(() => {
    if (initialized.current) return;
    initialized.current = true;

    if (isMain && messages.length === 0) {
      addAssistantMessage("Halo! 👋 Aku asisten atom kamu. Sekarang aku punya kekuatan sihir untuk mengubah simulasi di layar lho! Mau lihat atom apa? ⚛️");
    } else if (initialContext) {
      sendMessage(`Tolong jelaskan lebih detail mengenai bagian ini:\n\n"${initialContext}"`).catch(() => {});
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Auto-scroll
  useEffect(() => {
    setTimeout(() => {
      if (chatAreaRef.current) chatAreaRef.current.scrollTop = chatAreaRef.current.scrollHeight;
    }, 50);
  }, [messages, isLoading]);

  const handleSend = useCallback(async () => {
    const text = inputVal.trim();
    if (!text || isLoading) return;
    setInputVal('');
    try {
      await sendMessage(text);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : '';
      if (msg === 'API_KEY_MISSING') setSettings(true);
    }
  }, [inputVal, isLoading, sendMessage, setSettings]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') handleSend();
  };

  // --- Draggable panel ---
  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    if ((e.target as HTMLElement).closest('button, input')) return;
    const startX = e.clientX - position.x;
    const startY = e.clientY - position.y;

    const { highestZIndex } = useAtomStore.getState();
    const newZ = highestZIndex + 1;
    useAtomStore.setState({ highestZIndex: newZ });
    setZIndex(newZ);

    const onMove = (ev: MouseEvent) => {
      setPosition({ x: ev.clientX - startX, y: ev.clientY - startY });
    };
    const onUp = () => {
      window.removeEventListener('mousemove', onMove);
      window.removeEventListener('mouseup', onUp);
    };
    window.addEventListener('mousemove', onMove);
    window.addEventListener('mouseup', onUp);
  }, [position]);

  // Branch discussion
  const handleBranch = (content: string) => {
    addChatPanel({
      isMain: false,
      initialContext: content,
      messages: messages.filter(m => m.role === 'user' || m.role === 'assistant'),
    });
  };

  return (
    <div
      ref={panelRef}
      onMouseDown={() => bringToFront(id)}
      style={{
        position: 'absolute',
        left: position.x,
        top: position.y,
        width: w,
        height: h,
        zIndex,
      }}
      className="bg-white rounded-xl shadow-2xl flex flex-col pointer-events-auto border border-slate-200 overflow-hidden"
    >
      {/* Header — draggable */}
      <div
        onMouseDown={handleMouseDown}
        className={`${theme.bg} text-white px-4 py-3 flex items-center justify-between cursor-move select-none`}
      >
        <div className="flex items-center gap-2 flex-1 min-w-0">
          {/* Bot icon */}
          <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 3.104v5.714a2.25 2.25 0 01-.659 1.591L5 14.5M9.75 3.104c-.251.023-.501.05-.75.082m.75-.082a24.301 24.301 0 014.5 0m0 0v5.714c0 .597.237 1.17.659 1.591L19.8 15.3M14.25 3.104c.251.023.501.05.75.082M19.8 15.3l-1.57.393A9.065 9.065 0 0112 15a9.065 9.065 0 00-6.23-.693L5 14.5m14.8.8l1.402 1.402c1 1 .3 2.7-1.1 2.7H4.9c-1.4 0-2.1-1.7-1.1-2.7L5 14.5" />
          </svg>
          {isEditing ? (
            <input
              autoFocus
              value={panelName}
              onChange={(e) => setPanelName(e.target.value)}
              onBlur={() => setIsEditing(false)}
              onKeyDown={(e) => e.key === 'Enter' && setIsEditing(false)}
              className="bg-transparent border-none text-white font-semibold focus:ring-0 w-full outline-none"
            />
          ) : (
            <span className="font-semibold truncate">{panelName}</span>
          )}
          <button
            onClick={() => setIsEditing(true)}
            className="hover:bg-white/20 p-1 rounded transition-colors shrink-0"
            title="Ubah Nama"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
            </svg>
          </button>
        </div>

        <div className="flex items-center gap-1 shrink-0 ml-2">
          <button onClick={() => setSettings(true)} className="hover:bg-white/20 p-1 rounded transition-colors" title="Pengaturan API">
            <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
          </button>
          <button
            onClick={() => removePanel(id)}
            className="hover:bg-red-500 p-1 rounded transition-colors"
            title="Tutup"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      </div>

      {/* Chat Area */}
      <div ref={chatAreaRef} className="flex-1 overflow-y-auto p-4 bg-slate-50 space-y-4 text-sm">
        {messages
          .filter((m) => (m.role === 'user' || m.role === 'assistant') && m.content)
          .map((msg, idx) => (
            <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div
                className={`max-w-[90%] rounded-2xl px-4 py-3 ${
                  msg.role === 'user'
                    ? `${theme.bubble} text-white rounded-br-none`
                    : 'bg-white border border-slate-200 text-slate-700 rounded-bl-none shadow-sm'
                }`}
              >
                {msg.role === 'user' ? (
                  // Tampilkan teks singkat jika ini adalah branch context prompt
                  <p>{msg.content?.includes('Tolong jelaskan lebih detail mengenai bagian ini:')
                    ? 'Tolong jelaskan lebih detail tentang bagian ini 💬'
                    : msg.content}</p>
                ) : (
                  <div className="prose prose-sm max-w-none text-current leading-relaxed">
                    <ReactMarkdown remarkPlugins={[remarkGfm]}>
                      {msg.content ?? ''}
                    </ReactMarkdown>
                    {/* Branch button */}
                    <button
                      onClick={() => handleBranch(msg.content ?? '')}
                      className={`mt-3 text-xs flex items-center gap-1.5 ${theme.textBtn} font-semibold ${theme.bgLight} px-3 py-1.5 rounded-lg transition-colors border ${theme.borderBtn} ${theme.hoverBorderBtn} shadow-sm not-prose`}
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7v8a2 2 0 002 2h6M8 7V5a2 2 0 012-2h4.586a1 1 0 01.707.293l4.414 4.414a1 1 0 01.293.707V15a2 2 0 01-2 2h-2M8 7H6a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2v-2" />
                      </svg>
                      Bahas lebih lanjut
                    </button>
                  </div>
                )}
              </div>
            </div>
          ))}

        {/* Typing indicator */}
        {isLoading && (
          <div className="flex justify-start">
            <div className="bg-slate-200 w-max rounded-2xl rounded-bl-none px-4 py-2 flex items-center gap-1.5">
              <div className="w-2 h-2 bg-slate-500 rounded-full animate-bounce [animation-delay:-0.32s]" />
              <div className="w-2 h-2 bg-slate-500 rounded-full animate-bounce [animation-delay:-0.16s]" />
              <div className="w-2 h-2 bg-slate-500 rounded-full animate-bounce" />
            </div>
          </div>
        )}
      </div>

      {/* Input Area */}
      <div className="p-3 bg-white border-t border-slate-200">
        <div className="flex gap-2">
          <input
            ref={inputRef}
            type="text"
            value={inputVal}
            onChange={(e) => setInputVal(e.target.value)}
            onKeyDown={handleKeyDown}
            disabled={isLoading}
            placeholder="Tanya tentang atom ini..."
            className="flex-1 border border-slate-300 rounded-full px-4 py-2 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 text-sm disabled:opacity-50"
          />
          <button
            onClick={handleSend}
            disabled={isLoading || !inputVal.trim()}
            className={`${theme.bg} ${theme.hover} text-white p-2.5 rounded-full transition-colors flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed`}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}
