'use client';

import { useEffect, useRef, useState } from 'react';
import { useAtomStore } from '@/hooks/useAtomStore';

declare global {
  interface Window {
    MathJax?: {
      typesetPromise?: (els: (Element | null)[]) => Promise<void>;
      typesetClear?: (els: (Element | null)[]) => void;
    };
  }
}

export default function SimulationPanel() {
  const selectedAtom    = useAtomStore((s) => s.selectedAtom);
  const animSpeed       = useAtomStore((s) => s.animSpeed);
  const setAnimSpeed    = useAtomStore((s) => s.setAnimSpeed);
  const uiOpacity       = useAtomStore((s) => s.uiOpacity);
  const setUiOpacity    = useAtomStore((s) => s.setUiOpacity);
  const isPanelOpen     = useAtomStore((s) => s.isPanelOpen);
  const togglePanel     = useAtomStore((s) => s.togglePanel);
  const setIsPTModal    = useAtomStore((s) => s.setIsPTModalOpen);
  const mathRef         = useRef<HTMLSpanElement>(null);

  const atom = selectedAtom;

  // Render MathJax setiap kali atom berubah
  useEffect(() => {
    if (!mathRef.current || !atom) return;
    const node = mathRef.current;
    const mathStr = `$$^{${atom.a}}_{${atom.z}}\\mathrm{${atom.symbol}}$$`;
    if (window.MathJax?.typesetClear) window.MathJax.typesetClear([node]);
    node.innerHTML = mathStr;
    if (window.MathJax?.typesetPromise) {
      window.MathJax.typesetPromise([node]).catch(console.error);
    }
  }, [atom]);

  return (
    <div
      id="uiPanel"
      style={{ opacity: uiOpacity }}
      className={`absolute top-0 left-0 h-full w-full lg:w-[400px] bg-white/95 backdrop-blur-xl shadow-2xl transition-transform duration-500 ease-in-out z-30 flex flex-col overflow-y-auto border-r border-white/50
        ${isPanelOpen ? 'translate-x-0' : '-translate-x-full'}`}
    >
      {/* Close button (mobile) */}
      <div className="absolute top-4 right-4 z-50 block lg:hidden">
        <button
          onClick={togglePanel}
          className="bg-slate-200/50 hover:bg-red-100 text-slate-500 hover:text-red-500 p-2 rounded-full transition-colors"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      <div className="flex flex-col gap-6 p-8 w-full mt-10 lg:mt-0">

        {/* Header */}
        <div className="flex flex-col space-y-2">
          <div className="inline-block bg-indigo-100 text-indigo-700 px-3 py-1 rounded-full text-xs font-bold tracking-wider mb-1 w-max">
            SIMULATOR KIMIA
          </div>
          <h1 className="text-3xl font-extrabold text-slate-800 leading-tight">
            Struktur<br />
            <span className="text-indigo-600">Atom 3D</span>
          </h1>
        </div>

        {/* Tombol Tabel Periodik */}
        <div className="flex flex-col space-y-4">
          <button
            id="btnOpenPT"
            onClick={() => setIsPTModal(true)}
            className="group relative w-full flex justify-center py-4 px-4 border border-transparent text-sm font-bold rounded-xl text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 shadow-lg shadow-indigo-500/30 transition-all overflow-hidden"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
            <div className="flex items-center gap-2 relative z-10">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                  d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"
                />
              </svg>
              Pilih Atom dari Tabel Periodik
            </div>
          </button>
        </div>

        {/* Info Partikel */}
        {atom && (
          <div className="flex flex-col space-y-3">
            <h2 className="text-sm font-bold text-slate-700 border-b border-slate-200 pb-2">
              Identitas &amp; Komposisi Partikel
            </h2>

            <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-200 space-y-3">
              {/* Math Notation */}
              <div className="flex flex-col justify-center items-center py-3 bg-slate-50 rounded-lg border border-slate-100 mb-2">
                <span id="mathNotation" ref={mathRef} className="text-4xl">
                  {`$$^{${atom.a}}_{${atom.z}}\\mathrm{${atom.symbol}}$$`}
                </span>
                <span className="text-sm font-bold text-slate-600 mt-2 bg-slate-200 px-3 py-1 rounded-full">
                  {atom.name} ({atom.symbol})
                </span>
              </div>

              {/* Proton */}
              <div className="flex justify-between items-center p-2 rounded bg-red-50 text-red-700">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-red-500 shadow-sm" />
                  <span className="text-sm font-semibold">Proton (p⁺)</span>
                </div>
                <span className="font-mono font-bold text-lg">{atom.p}</span>
              </div>

              {/* Neutron */}
              <div className="flex justify-between items-center p-2 rounded bg-slate-100 text-slate-600">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-slate-400 shadow-sm" />
                  <span className="text-sm font-semibold">Neutron (n⁰)</span>
                </div>
                <span className="font-mono font-bold text-lg">{atom.n}</span>
              </div>

              {/* Elektron */}
              <div className="flex justify-between items-center p-2 rounded bg-yellow-50 text-yellow-700">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-yellow-400 shadow-sm" />
                  <span className="text-sm font-semibold">Elektron (e⁻)</span>
                </div>
                <span className="font-mono font-bold text-lg">{atom.e}</span>
              </div>
            </div>

            {/* Konfigurasi Kulit Elektron */}
            <div className="bg-indigo-900 text-slate-100 p-4 rounded-xl shadow-lg border border-indigo-800">
              <h3 className="text-xs font-semibold text-indigo-300 mb-2 uppercase tracking-wider">
                Konfigurasi Kulit Elektron
              </h3>
              <p className="text-lg font-mono text-white tracking-widest break-words">
                {atom.config.join(', ')}
              </p>
            </div>
          </div>
        )}

        {/* Kontrol Visual */}
        <div className="flex flex-col space-y-4 bg-slate-50 p-5 rounded-2xl border border-slate-200 shadow-sm mt-4">
          <h2 className="text-sm font-bold text-slate-700 border-b border-slate-200 pb-2">Kontrol Visual</h2>

          {/* Speed Slider */}
          <div className="space-y-2 pt-2">
            <div className="flex justify-between items-center">
              <label className="text-xs font-semibold text-slate-600">Kecepatan Orbit</label>
              <span className="text-xs font-bold text-indigo-600 bg-indigo-100 px-2 py-0.5 rounded">
                {animSpeed.toFixed(1)}x
              </span>
            </div>
            <input
              id="speedInput"
              type="range"
              min="0.1"
              max="3"
              step="0.1"
              value={animSpeed}
              onChange={(e) => setAnimSpeed(parseFloat(e.target.value))}
              className="w-full h-1.5 bg-slate-300 rounded-lg appearance-none cursor-pointer accent-indigo-600"
            />
          </div>

          {/* Opacity Slider */}
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <label className="text-xs font-semibold text-slate-600">Transparansi Panel</label>
              <span className="text-xs font-bold text-indigo-600 bg-indigo-100 px-2 py-0.5 rounded">
                {Math.round(uiOpacity * 100)}%
              </span>
            </div>
            <input
              id="opacityInput"
              type="range"
              min="0.2"
              max="1"
              step="0.05"
              value={uiOpacity}
              onChange={(e) => setUiOpacity(parseFloat(e.target.value))}
              className="w-full h-1.5 bg-slate-300 rounded-lg appearance-none cursor-pointer accent-indigo-600"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
