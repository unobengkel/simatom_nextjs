// ============================================================
// lib/atomTypes.ts — Semua TypeScript interfaces untuk SIMATOM
// ============================================================

export interface ElementData {
  z: number;        // Nomor atom
  symbol: string;   // Simbol (e.g. "Au")
  name: string;     // Nama Indonesia (e.g. "Emas")
  a: number;        // Nomor massa
  p: number;        // Proton
  e: number;        // Elektron
  n: number;        // Neutron
  config: number[]; // Konfigurasi elektron per kulit
}

export interface ChatMessage {
  role: 'user' | 'assistant' | 'system' | 'tool';
  content: string | null;
  tool_calls?: ToolCall[];
  tool_call_id?: string;
}

export interface ToolCall {
  id: string;
  type: 'function';
  function: {
    name: string;
    arguments: string;
  };
}

export interface PanelTheme {
  bg: string;
  hover: string;
  bubble: string;
  textBtn: string;
  borderBtn: string;
  hoverBorderBtn: string;
  bgLight: string;
}

export interface ChatPanelConfig {
  id: string;
  isMain: boolean;
  theme: PanelTheme;
  panelName: string;
  messages: ChatMessage[];
  initialContext?: string;
  position: { x: number; y: number };
  zIndex: number;
}
