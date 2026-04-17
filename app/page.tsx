'use client';

import dynamic from 'next/dynamic';
import { useEffect } from 'react';
import { useAtomStore } from '@/hooks/useAtomStore';

// Three.js canvas — dynamic import, no SSR (butuh window)
const ThreeCanvas = dynamic(() => import('@/components/ThreeCanvas'), { ssr: false });

// UI Components
import FloatingButtons    from '@/components/FloatingButtons';
import SimulationPanel    from '@/components/SimulationPanel';
import PeriodicTableModal from '@/components/PeriodicTableModal';
import AtomInfoModal      from '@/components/AtomInfoModal';

// AI Components
import ChatFab            from '@/components/ai/ChatFab';
import ChatPanelsContainer from '@/components/ai/ChatPanelsContainer';
import SettingsModal      from '@/components/ai/SettingsModal';

export default function HomePage() {
  const selectAtomByZ = useAtomStore((s) => s.selectAtomByZ);
  const setPanelOpen  = useAtomStore((s) => s.setPanelOpen);

  // Load default atom (Emas, Z=79) saat pertama kali
  useEffect(() => {
    selectAtomByZ(79);
    // Tutup panel sidebar di mobile
    if (window.innerWidth < 1024) {
      setPanelOpen(false);
    }
  }, [selectAtomByZ, setPanelOpen]);

  return (
    <main className="relative w-full h-screen overflow-hidden">
      {/* Layer 1: Three.js 3D Canvas (background) */}
      <ThreeCanvas />

      {/* Layer 2: Floating buttons (gear + info) */}
      <FloatingButtons />

      {/* Layer 3: Sidebar panel kiri */}
      <SimulationPanel />

      {/* Modals */}
      <PeriodicTableModal />
      <AtomInfoModal />

      {/* Layer AI Chat */}
      <ChatFab />
      <ChatPanelsContainer />
      <SettingsModal />
    </main>
  );
}
