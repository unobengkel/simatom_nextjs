'use client';

import { useAtomStore } from '@/hooks/useAtomStore';
import ChatPanel from './ChatPanel';

export default function ChatPanelsContainer() {
  const panels = useAtomStore((s) => s.chatPanels);

  return (
    <div
      id="panelsContainer"
      className="fixed inset-0 pointer-events-none z-[200]"
    >
      {panels.map((panel) => (
        <ChatPanel key={panel.id} panelConfig={panel} />
      ))}
    </div>
  );
}
