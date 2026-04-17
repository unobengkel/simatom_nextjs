'use client';

import { useEffect, useRef } from 'react';
import { useAtomStore } from '@/hooks/useAtomStore';
import { elementRawData } from '@/lib/atomData';
import { getGridPos, getBlockColor, getElementData } from '@/lib/atomUtils';

export default function PeriodicTableModal() {
  const isOpen       = useAtomStore((s) => s.isPTModalOpen);
  const setIsOpen    = useAtomStore((s) => s.setIsPTModalOpen);
  const setAtom      = useAtomStore((s) => s.setSelectedAtom);
  const setPanelOpen = useAtomStore((s) => s.setPanelOpen);
  const overlayRef   = useRef<HTMLDivElement>(null);

  const handleSelectAtom = (z: number) => {
    const data = getElementData(z);
    setAtom(data);
    setIsOpen(false);
    if (typeof window !== 'undefined' && window.innerWidth < 1024) {
      setPanelOpen(true);
    }
  };

  // Close on backdrop click
  const handleBackdrop = (e: React.MouseEvent) => {
    if (e.target === overlayRef.current) setIsOpen(false);
  };

  // Close on Escape
  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') setIsOpen(false); };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [setIsOpen]);

  if (!isOpen) return null;

  return (
    <div
      ref={overlayRef}
      onClick={handleBackdrop}
      className="fixed inset-0 bg-slate-900/95 backdrop-blur-md z-[100] flex flex-col items-center animate-fadeIn"
    >
      {/* Header */}
      <div className="w-full max-w-7xl flex justify-between items-center p-4 md:p-6 border-b border-slate-700">
        <div>
          <h2 className="text-2xl font-bold text-white">Tabel Periodik Unsur</h2>
          <p className="text-sm text-slate-400 mt-1">Pilih unsur untuk merender simulasi model atomnya.</p>
        </div>
        <button
          onClick={() => setIsOpen(false)}
          className="text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 p-2.5 rounded-full transition-colors focus:outline-none"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      {/* Legenda Blok */}
      <div className="w-full max-w-7xl px-4 md:px-6 pt-4 flex gap-4 text-xs md:text-sm text-slate-300 flex-wrap">
        <div className="flex items-center gap-1.5"><div className="w-3 h-3 bg-blue-400 rounded" />Blok-s</div>
        <div className="flex items-center gap-1.5"><div className="w-3 h-3 bg-green-400 rounded" />Blok-p</div>
        <div className="flex items-center gap-1.5"><div className="w-3 h-3 bg-yellow-400 rounded" />Blok-d</div>
        <div className="flex items-center gap-1.5"><div className="w-3 h-3 bg-purple-400 rounded" />Blok-f</div>
      </div>

      {/* Grid Tabel Periodik */}
      <div className="w-full max-w-7xl flex-1 overflow-auto p-4 md:p-6 pb-20">
        <div
          className="min-w-[850px]"
          style={{ display: 'grid', gridTemplateColumns: 'repeat(18, minmax(45px, 1fr))', gap: '4px' }}
        >
          {/* Spacer lantanida / aktinida */}
          <div style={{ gridRow: 6, gridColumn: 3 }} className="flex items-center justify-center text-slate-500 font-bold text-xs">57–71</div>
          <div style={{ gridRow: 7, gridColumn: 3 }} className="flex items-center justify-center text-slate-500 font-bold text-xs">89–103</div>

          {elementRawData.map((raw, idx) => {
            const z = idx + 1;
            const parts = raw.split(',');
            const pos = getGridPos(z);
            const colorClass = getBlockColor(z, pos.c, pos.r);
            return (
              <button
                key={z}
                onClick={() => handleSelectAtom(z)}
                title={`${parts[1]} (${parts[0]}) — Massa: ${parts[2]}`}
                style={{ gridColumn: pos.c, gridRow: pos.r }}
                className={`relative p-1 md:p-2 border rounded-md flex flex-col items-center justify-center cursor-pointer transition-all duration-200 hover:scale-110 hover:z-10 hover:shadow-lg ${colorClass}`}
              >
                <span className="absolute top-0.5 left-1 text-[8px] md:text-[10px] font-bold opacity-70">{z}</span>
                <span className="text-sm md:text-xl font-bold mt-1">{parts[0]}</span>
                <span className="text-[7px] md:text-[9px] truncate w-full text-center opacity-80">{parts[1]}</span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
