'use client';

import { useAtomStore } from '@/hooks/useAtomStore';

export default function SettingsModal() {
  const isOpen    = useAtomStore((s) => s.isSettingsModalOpen);
  const setIsOpen = useAtomStore((s) => s.setIsSettingsModalOpen);

  const handleSave = () => {
    const input = document.getElementById('apiKeyInput') as HTMLInputElement;
    if (input?.value.trim()) {
      localStorage.setItem('deepseek_api_key', input.value.trim());
    }
    setIsOpen(false);
  };

  if (!isOpen) return null;

  const savedKey = typeof window !== 'undefined' ? localStorage.getItem('deepseek_api_key') || '' : '';

  return (
    <div
      className="fixed inset-0 bg-slate-900/80 backdrop-blur-sm z-[250] flex items-center justify-center animate-fadeIn"
      onClick={(e) => { if (e.target === e.currentTarget) setIsOpen(false); }}
    >
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-6 animate-scaleIn mx-4">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold flex items-center gap-2 text-slate-800">
            <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
              />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            Pengaturan DeepSeek
          </h2>
          <button
            onClick={() => setIsOpen(false)}
            className="text-slate-400 hover:text-red-500 bg-slate-100 hover:bg-red-50 p-1.5 rounded-full transition-colors"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Form */}
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              API Key DeepSeek
            </label>
            <input
              type="password"
              id="apiKeyInput"
              defaultValue={savedKey}
              placeholder="sk-..."
              className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all text-sm"
            />
            <p className="text-xs text-slate-500 mt-2">
              Dapatkan API Key di{' '}
              <a
                href="https://platform.deepseek.com/"
                target="_blank"
                rel="noreferrer"
                className="text-indigo-600 hover:underline"
              >
                platform.deepseek.com
              </a>
              . Kunci disimpan lokal di browser Anda.
            </p>
          </div>

          <button
            onClick={handleSave}
            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-2.5 rounded-lg transition-colors shadow-lg shadow-indigo-200"
          >
            Simpan Pengaturan
          </button>
        </div>
      </div>
    </div>
  );
}
