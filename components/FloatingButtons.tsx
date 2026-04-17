'use client';

import { useAtomStore } from '@/hooks/useAtomStore';

export default function FloatingButtons() {
  const togglePanel     = useAtomStore((s) => s.togglePanel);
  const setInfoModal    = useAtomStore((s) => s.setIsInfoModalOpen);
  const isPanelOpen     = useAtomStore((s) => s.isPanelOpen);

  return (
    <div
      id="floatingBtnContainer"
      className="absolute top-4 left-4 z-40 flex flex-col gap-3 transition-opacity duration-500"
    >
      {/* Toggle Panel */}
      <button
        id="toggleBtn"
        title="Buka/Tutup Panel Parameter"
        onClick={togglePanel}
        className="bg-white/90 p-3 rounded-full shadow-lg hover:bg-indigo-100 transition-all border border-slate-200 group focus:outline-none"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className={`h-6 w-6 text-indigo-600 transition-transform duration-300 ${isPanelOpen ? 'rotate-90' : ''}`}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
            d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
          />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
      </button>

      {/* Info Modal Button */}
      <button
        id="infoBtn"
        title="Penjelasan Detail Atom"
        onClick={() => setInfoModal(true)}
        className="bg-white/90 p-3 rounded-full shadow-lg hover:bg-sky-100 transition-all border border-slate-200 group focus:outline-none"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-6 w-6 text-sky-600 group-hover:scale-110 transition-transform duration-300"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
            d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
      </button>
    </div>
  );
}
