'use client';

import { useEffect, useRef } from 'react';
import { useAtomStore } from '@/hooks/useAtomStore';

export default function AtomInfoModal() {
  const isOpen   = useAtomStore((s) => s.isInfoModalOpen);
  const setIsOpen = useAtomStore((s) => s.setIsInfoModalOpen);
  const contentRef = useRef<HTMLDivElement>(null);

  // Render MathJax saat modal terbuka
  useEffect(() => {
    if (isOpen && typeof window !== 'undefined' && window.MathJax?.typesetPromise) {
      window.MathJax.typesetPromise([document.getElementById('infoModalContent')]).catch(console.error);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 bg-slate-900/80 backdrop-blur-sm z-[110] flex items-center justify-center p-4 animate-fadeIn"
      onClick={(e) => { if (e.target === e.currentTarget) setIsOpen(false); }}
    >
      <div
        id="infoModalContent"
        ref={contentRef}
        className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[85vh] flex flex-col relative animate-scaleIn"
      >
        {/* Header */}
        <div className="flex justify-between items-center p-5 md:p-6 border-b border-slate-200">
          <h2 className="text-xl md:text-2xl font-bold text-slate-800 flex items-center gap-2">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z"
              />
            </svg>
            Teori Dasar Atom
          </h2>
          <button
            onClick={() => setIsOpen(false)}
            className="text-slate-400 hover:text-red-500 bg-slate-100 hover:bg-red-50 p-2 rounded-full transition-colors"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Body */}
        <div className="p-5 md:p-8 overflow-y-auto text-slate-700 leading-relaxed space-y-6">
          <p>
            Atom adalah unit dasar penyusun materi. Simulasi ini menggunakan modifikasi dari
            <strong> Model Atom Bohr</strong>. Inti atom (nukleus) yang padat berada di tengah,
            dan elektron mengorbit di sekitarnya dalam kulit-kulit tertentu.
          </p>

          <div className="bg-indigo-50 border-l-4 border-indigo-500 p-4 rounded-r-lg">
            <p className="font-medium text-slate-800 mb-2">Notasi Standar Atom:</p>
            <div className="text-center text-2xl text-indigo-900 overflow-x-auto py-2">
              {`$$^{A}_{Z}\\mathrm{X}$$`}
            </div>
            <p className="text-sm text-slate-600 mt-2">
              <strong>A</strong> = Nomor Massa &nbsp;|&nbsp; <strong>Z</strong> = Nomor Atom &nbsp;|&nbsp; <strong>X</strong> = Simbol Unsur
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-red-50 rounded-xl p-4 text-center border border-red-100">
              <div className="text-2xl mb-2">🔴</div>
              <h3 className="font-bold text-red-700 mb-1">Proton</h3>
              <p className="text-xs text-slate-600">Bermuatan <strong>positif (+)</strong>, berada di inti atom</p>
            </div>
            <div className="bg-slate-100 rounded-xl p-4 text-center border border-slate-200">
              <div className="text-2xl mb-2">⚪</div>
              <h3 className="font-bold text-slate-700 mb-1">Neutron</h3>
              <p className="text-xs text-slate-600">Bermuatan <strong>netral (0)</strong>, berada di inti atom</p>
            </div>
            <div className="bg-yellow-50 rounded-xl p-4 text-center border border-yellow-100">
              <div className="text-2xl mb-2">🟡</div>
              <h3 className="font-bold text-yellow-700 mb-1">Elektron</h3>
              <p className="text-xs text-slate-600">Bermuatan <strong>negatif (−)</strong>, mengorbit inti</p>
            </div>
          </div>

          <div className="bg-indigo-900 text-white rounded-xl p-4">
            <h3 className="font-semibold text-indigo-300 text-sm mb-2 uppercase tracking-wider">Aturan Pengisian Kulit</h3>
            <p className="text-sm">Maksimum elektron per kulit: <span className="font-mono text-yellow-300">2n²</span></p>
            <p className="text-sm mt-1 text-slate-300">
              Kulit K (n=1): max 2 &nbsp;|&nbsp; Kulit L (n=2): max 8 &nbsp;|&nbsp; Kulit M (n=3): max 18
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
