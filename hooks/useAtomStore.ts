// ============================================================
// hooks/useAtomStore.ts — Zustand global state SIMATOM
// ============================================================
'use client';

import { create } from 'zustand';
import type { ElementData, ChatPanelConfig } from '@/lib/atomTypes';
import { PANEL_THEMES } from '@/lib/atomData';
import { getElementData } from '@/lib/atomUtils';

interface AtomStore {
  // Atom state
  selectedAtom: ElementData | null;
  setSelectedAtom: (atom: ElementData) => void;
  selectAtomByZ: (z: number) => void;

  // Visual controls
  animSpeed: number;
  setAnimSpeed: (v: number) => void;
  uiOpacity: number;
  setUiOpacity: (v: number) => void;

  // Panel sidebar
  isPanelOpen: boolean;
  togglePanel: () => void;
  setPanelOpen: (v: boolean) => void;

  // Modals
  isPTModalOpen: boolean;
  setIsPTModalOpen: (v: boolean) => void;
  isInfoModalOpen: boolean;
  setIsInfoModalOpen: (v: boolean) => void;
  isSettingsModalOpen: boolean;
  setIsSettingsModalOpen: (v: boolean) => void;

  // AI Chat panels
  chatPanels: ChatPanelConfig[];
  highestZIndex: number;
  nextThemeIndex: number;
  addChatPanel: (config?: Partial<ChatPanelConfig>) => string;
  removeChatPanel: (id: string) => void;
  updateChatPanel: (id: string, updates: Partial<ChatPanelConfig>) => void;
  bringToFront: (id: string) => void;
}

export const useAtomStore = create<AtomStore>((set, get) => ({
  // Atom state
  selectedAtom: null,
  setSelectedAtom: (atom) => set({ selectedAtom: atom }),
  selectAtomByZ: (z) => {
    const data = getElementData(z);
    set({ selectedAtom: data });
  },

  // Visual controls
  animSpeed: 1,
  setAnimSpeed: (v) => set({ animSpeed: v }),
  uiOpacity: 0.95,
  setUiOpacity: (v) => set({ uiOpacity: v }),

  // Panel sidebar
  isPanelOpen: true,
  togglePanel: () => set((s) => ({ isPanelOpen: !s.isPanelOpen })),
  setPanelOpen: (v) => set({ isPanelOpen: v }),

  // Modals
  isPTModalOpen: false,
  setIsPTModalOpen: (v) => set({ isPTModalOpen: v }),
  isInfoModalOpen: false,
  setIsInfoModalOpen: (v) => set({ isInfoModalOpen: v }),
  isSettingsModalOpen: false,
  setIsSettingsModalOpen: (v) => set({ isSettingsModalOpen: v }),

  // AI Chat panels
  chatPanels: [],
  highestZIndex: 200,
  nextThemeIndex: 1,

  addChatPanel: (config = {}) => {
    const { highestZIndex, nextThemeIndex } = get();
    const isMain = config.isMain ?? false;
    const id = 'chat-' + Math.random().toString(36).substr(2, 9);
    const theme = isMain ? PANEL_THEMES[0] : PANEL_THEMES[nextThemeIndex % PANEL_THEMES.length];

    const w = typeof window !== 'undefined' ? (window.innerWidth < 640 ? window.innerWidth * 0.9 : 380) : 380;
    const h = typeof window !== 'undefined' ? (window.innerWidth < 640 ? window.innerHeight * 0.8 : 500) : 500;
    const x = typeof window !== 'undefined' ? Math.max(10, (window.innerWidth - w) / 2 + (Math.random() * 40 - 20)) : 100;
    const y = typeof window !== 'undefined' ? Math.max(10, (window.innerHeight - h) / 2 + (Math.random() * 40 - 20)) : 100;

    const newPanel: ChatPanelConfig = {
      panelName: isMain ? 'Tanya Asisten Atom' : 'Diskusi Lanjutan',
      messages: [],
      position: { x, y },
      ...config,
      // Override — harus selalu dari kalkulasi di sini
      id,
      isMain,
      theme,
      zIndex: highestZIndex + 1,
    };

    set((s) => ({
      chatPanels: [...s.chatPanels, newPanel],
      highestZIndex: s.highestZIndex + 1,
      nextThemeIndex: isMain ? s.nextThemeIndex : s.nextThemeIndex + 1,
    }));
    return id;
  },

  removeChatPanel: (id) =>
    set((s) => ({ chatPanels: s.chatPanels.filter((p) => p.id !== id) })),

  updateChatPanel: (id, updates) =>
    set((s) => ({
      chatPanels: s.chatPanels.map((p) => (p.id === id ? { ...p, ...updates } : p)),
    })),

  bringToFront: (id) => {
    const { highestZIndex } = get();
    const newZ = highestZIndex + 1;
    set((s) => ({
      highestZIndex: newZ,
      chatPanels: s.chatPanels.map((p) => (p.id === id ? { ...p, zIndex: newZ } : p)),
    }));
  },
}));
