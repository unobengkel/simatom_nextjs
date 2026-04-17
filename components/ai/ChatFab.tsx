'use client';

import { useRef, useState, useCallback } from 'react';
import { useAtomStore } from '@/hooks/useAtomStore';

export default function ChatFab() {
  const addChatPanel  = useAtomStore((s) => s.addChatPanel);
  const chatPanels    = useAtomStore((s) => s.chatPanels);
  const [fabPos, setFabPos] = useState({ x: -1, y: -1 }); // -1 = pakai CSS default
  const isDraggingRef = useRef(false);
  const fabRef = useRef<HTMLDivElement>(null);

  const hasMainPanel = chatPanels.some((p) => p.isMain);

  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    isDraggingRef.current = false;
    const startX = e.clientX;
    const startY = e.clientY;
    const startLeft = fabRef.current?.offsetLeft ?? 0;
    const startTop  = fabRef.current?.offsetTop  ?? 0;

    const onMove = (ev: MouseEvent) => {
      const dx = ev.clientX - startX;
      const dy = ev.clientY - startY;
      if (Math.abs(dx) > 4 || Math.abs(dy) > 4) isDraggingRef.current = true;
      setFabPos({ x: startLeft + dx, y: startTop + dy });
    };
    const onUp = () => {
      window.removeEventListener('mousemove', onMove);
      window.removeEventListener('mouseup', onUp);
      setTimeout(() => { isDraggingRef.current = false; }, 100);
    };
    window.addEventListener('mousemove', onMove);
    window.addEventListener('mouseup', onUp);
  }, []);

  const handleClick = useCallback(() => {
    if (isDraggingRef.current) return;

    const rect = fabRef.current?.getBoundingClientRect();
    const w = typeof window !== 'undefined' ? (window.innerWidth < 640 ? window.innerWidth * 0.9 : 380) : 380;
    const h = typeof window !== 'undefined' ? (window.innerWidth < 640 ? window.innerHeight * 0.8 : 500) : 500;
    const x = rect ? Math.max(10, Math.min(window.innerWidth - w - 10, rect.left - w + rect.width)) : 100;
    const y = rect ? Math.max(10, Math.min(window.innerHeight - h - 10, rect.top - h - 10)) : 100;

    if (!hasMainPanel) {
      addChatPanel({ isMain: true, position: { x, y } });
    }
  }, [addChatPanel, hasMainPanel]);

  const posStyle = fabPos.x >= 0
    ? { left: fabPos.x, top: fabPos.y, position: 'fixed' as const, bottom: 'auto', right: 'auto' }
    : {};

  return (
    <div
      ref={fabRef}
      role="button"
      id="mainChatIcon"
      onMouseDown={handleMouseDown}
      onClick={handleClick}
      style={posStyle}
      className={`fixed bottom-6 right-6 z-[150] bg-indigo-600 text-white p-4 rounded-full shadow-2xl cursor-pointer hover:bg-indigo-700 transition-transform hover:scale-110 flex items-center justify-center select-none ${fabPos.x < 0 ? '' : ''}`}
    >
      {/* Chat bubble icon */}
      <svg xmlns="http://www.w3.org/2000/svg" className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
          d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
        />
      </svg>
      {/* Notification dot */}
      <div className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full border-2 border-slate-900 animate-pulse" />
    </div>
  );
}
