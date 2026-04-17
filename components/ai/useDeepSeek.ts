// ============================================================
// components/ai/useDeepSeek.ts
// Custom hook: DeepSeek API + Function Calling untuk SIMATOM
// ============================================================
'use client';

import { useState, useCallback, useRef } from 'react';
import { useAtomStore } from '@/hooks/useAtomStore';
import { getElementData } from '@/lib/atomUtils';
import type { ChatMessage } from '@/lib/atomTypes';

// Definisi tools yang bisa dipanggil AI
const SIM_TOOLS = [
  {
    type: 'function',
    function: {
      name: 'change_atom',
      description: 'Mengubah atom yang ditampilkan di simulasi 3D ke unsur lain.',
      parameters: {
        type: 'object',
        properties: {
          atomic_number: { type: 'integer', description: 'Nomor atom (Z) dari tabel periodik, nilai 1 sampai 118.' },
        },
        required: ['atomic_number'],
      },
    },
  },
  {
    type: 'function',
    function: {
      name: 'set_simulation_speed',
      description: 'Mengubah kecepatan rotasi dan orbit elektron di dalam simulasi.',
      parameters: {
        type: 'object',
        properties: {
          speed: { type: 'number', description: 'Pengali kecepatan. 0.1 sangat lambat, 1.0 normal, 3.0 sangat cepat.' },
        },
        required: ['speed'],
      },
    },
  },
  {
    type: 'function',
    function: {
      name: 'set_panel_opacity',
      description: 'Mengubah tingkat transparansi panel UI agar simulasi 3D lebih terlihat.',
      parameters: {
        type: 'object',
        properties: {
          opacity: { type: 'integer', description: 'Persentase transparansi dari 20 (transparan) sampai 100 (solid).' },
        },
        required: ['opacity'],
      },
    },
  },
];

export function useDeepSeek(initialMessages: ChatMessage[] = []) {
  const [messages, setMessages] = useState<ChatMessage[]>(initialMessages);
  const [isLoading, setIsLoading] = useState(false);
  const messagesRef = useRef<ChatMessage[]>(initialMessages);

  const selectedAtom  = useAtomStore((s) => s.selectedAtom);
  const setAtom       = useAtomStore((s) => s.setSelectedAtom);
  const setAnimSpeed  = useAtomStore((s) => s.setAnimSpeed);
  const setUiOpacity  = useAtomStore((s) => s.setUiOpacity);

  const getSystemPrompt = useCallback(() => {
    const contextAtom = selectedAtom
      ? `Atom ${selectedAtom.name} (${selectedAtom.symbol}), dengan Nomor Atom (Z)=${selectedAtom.z}`
      : 'suatu atom';

    return `Kamu adalah asisten AI ajaib yang berada di dalam Simulasi Struktur Atom 3D.
Peran kamu: Membantu siswa SD dan SMP sesuai dengan kemampuan penalaran mereka (usia 11 - 15 tahun).
Aturan:
1. Jelaskan dengan kata-kata yang SANGAT MUDAH dipahami, riang, ramah, dan gunakan emoji.
2. Saat ini pengguna sedang melihat: ${contextAtom}. Gunakan info ini jika relevan.
3. PENTING: KAMU BISA MENGUBAH SIMULASI NYATA! Jika pengguna memintamu menunjukkan atom tertentu (misal: "tunjukkan atom oksigen", "ubah ke emas"), atau mengatur simulasi ("percepat", "lambatkan", "bikin panel transparan"), KAMU WAJIB menggunakan 'tools' yang tersedia untuk benar-benar mengubah layarnya.
4. Setelah menggunakan tool, beri tahu pengguna bahwa kamu baru saja mengubahnya di layar mereka!
5. PENTING UNTUK STYLING: SELALU gunakan format Markdown murni (seperti **tebal**, *miring*, atau - untuk list). Jangan pernah menggunakan tag HTML.`;
  }, [selectedAtom]);

  // Eksekusi tool call dan kembalikan hasilnya
  const executeTool = useCallback((name: string, args: Record<string, unknown>): string => {
    if (name === 'change_atom') {
      const z = parseInt(String(args.atomic_number));
      if (z >= 1 && z <= 118) {
        const data = getElementData(z);
        setAtom(data);
        return `BERHASIL. Simulasi telah diperbarui memuat atom ${data.name} dengan Nomor Atom ${z}.`;
      }
      return 'GAGAL. Nomor atom tidak valid. Harus rentang 1 hingga 118.';
    }

    if (name === 'set_simulation_speed') {
      const speed = parseFloat(String(args.speed));
      if (speed >= 0.1 && speed <= 3) {
        setAnimSpeed(speed);
        return `BERHASIL. Kecepatan simulasi saat ini adalah ${speed}x.`;
      }
      return 'GAGAL. Nilai kecepatan harus di antara 0.1 dan 3.0.';
    }

    if (name === 'set_panel_opacity') {
      const op = parseInt(String(args.opacity));
      if (op >= 20 && op <= 100) {
        setUiOpacity(op / 100);
        return `BERHASIL. Transparansi UI panel telah disetel ke ${op}%.`;
      }
      return 'GAGAL. Opasitas harus di antara 20 dan 100.';
    }

    return 'ERROR. Alat tidak dikenali.';
  }, [setAtom, setAnimSpeed, setUiOpacity]);

  const sendMessage = useCallback(async (userText: string): Promise<void> => {
    const apiKey = localStorage.getItem('deepseek_api_key');
    if (!apiKey) throw new Error('API_KEY_MISSING');

    const userMsg: ChatMessage = { role: 'user', content: userText };
    const updatedMessages = [...messagesRef.current, userMsg];
    messagesRef.current = updatedMessages;
    setMessages([...updatedMessages]);
    setIsLoading(true);

    try {
      let keepGenerating = true;
      let currentMessages = [...updatedMessages];

      while (keepGenerating) {
        const payload = {
          model: 'deepseek-chat',
          messages: [
            { role: 'system', content: getSystemPrompt() },
            ...currentMessages,
          ],
          tools: SIM_TOOLS,
          temperature: 0.7,
          max_tokens: 1000,
        };

        const response = await fetch('https://api.deepseek.com/chat/completions', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${apiKey}`,
          },
          body: JSON.stringify(payload),
        });

        if (!response.ok) {
          const err = await response.json();
          throw new Error(err.error?.message || 'Terjadi kesalahan jaringan.');
        }

        const data = await response.json();
        const responseMessage = data.choices[0].message;

        if (responseMessage.tool_calls) {
          currentMessages = [...currentMessages, responseMessage];

          for (const toolCall of responseMessage.tool_calls) {
            const args = JSON.parse(toolCall.function.arguments);
            const result = executeTool(toolCall.function.name, args);
            currentMessages = [
              ...currentMessages,
              { role: 'tool', tool_call_id: toolCall.id, content: result },
            ];
          }
        } else {
          keepGenerating = false;
          currentMessages = [...currentMessages, responseMessage];
          messagesRef.current = currentMessages;
          setMessages([...currentMessages]);
        }
      }
    } finally {
      setIsLoading(false);
    }
  }, [getSystemPrompt, executeTool]);

  const addAssistantMessage = useCallback((content: string) => {
    const msg: ChatMessage = { role: 'assistant', content };
    messagesRef.current = [...messagesRef.current, msg];
    setMessages([...messagesRef.current]);
  }, []);

  return { messages, isLoading, sendMessage, addAssistantMessage };
}
