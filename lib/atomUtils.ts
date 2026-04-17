// ============================================================
// lib/atomUtils.ts — Pure utility functions untuk logika atom
// ============================================================

import { elementRawData } from "./atomData";
import type { ElementData } from "./atomTypes";

/**
 * Hitung konfigurasi elektron per kulit berdasarkan nomor atom Z
 */
export function getElectronConfig(z: number): number[] {
  // Override untuk unsur pengecualian (anomali konfigurasi)
  if (z === 24) return [2, 8, 13, 1];
  if (z === 29) return [2, 8, 18, 1];
  if (z === 47) return [2, 8, 18, 18, 1];
  if (z === 79) return [2, 8, 18, 32, 18, 1];

  const shells = [0, 0, 0, 0, 0, 0, 0];
  const orbitals = [
    { n: 1, cap: 2 },  { n: 2, cap: 2 }, { n: 2, cap: 6 },
    { n: 3, cap: 2 },  { n: 3, cap: 6 }, { n: 4, cap: 2 },
    { n: 3, cap: 10 }, { n: 4, cap: 6 }, { n: 5, cap: 2 },
    { n: 4, cap: 10 }, { n: 5, cap: 6 }, { n: 6, cap: 2 },
    { n: 4, cap: 14 }, { n: 5, cap: 10 }, { n: 6, cap: 6 },
    { n: 7, cap: 2 },  { n: 5, cap: 14 }, { n: 6, cap: 10 },
    { n: 7, cap: 6 },
  ];

  let remaining = z;
  for (const orb of orbitals) {
    if (remaining <= 0) break;
    const fill = Math.min(remaining, orb.cap);
    shells[orb.n - 1] += fill;
    remaining -= fill;
  }

  while (shells.length > 0 && shells[shells.length - 1] === 0) {
    shells.pop();
  }
  return shells;
}

/**
 * Ambil semua data unsur berdasarkan nomor atom Z
 */
export function getElementData(z: number): ElementData {
  const raw = elementRawData[z - 1].split(",");
  return {
    z,
    symbol: raw[0],
    name: raw[1],
    a: parseInt(raw[2]),
    p: z,
    e: z,
    n: parseInt(raw[2]) - z,
    config: getElectronConfig(z),
  };
}

/**
 * Hitung posisi grid (row, col) untuk Tabel Periodik standar
 */
export function getGridPos(z: number): { r: number; c: number } {
  if (z === 1)  return { r: 1, c: 1 };
  if (z === 2)  return { r: 1, c: 18 };
  if (z >= 3  && z <= 4)   return { r: 2, c: z - 2 };
  if (z >= 5  && z <= 10)  return { r: 2, c: z + 8 };
  if (z >= 11 && z <= 12)  return { r: 3, c: z - 10 };
  if (z >= 13 && z <= 18)  return { r: 3, c: z };
  if (z >= 19 && z <= 36)  return { r: 4, c: z - 18 };
  if (z >= 37 && z <= 54)  return { r: 5, c: z - 36 };
  if (z >= 55 && z <= 56)  return { r: 6, c: z - 54 };
  if (z >= 72 && z <= 86)  return { r: 6, c: z - 68 };
  if (z >= 87 && z <= 88)  return { r: 7, c: z - 86 };
  if (z >= 104 && z <= 118) return { r: 7, c: z - 100 };
  if (z >= 57 && z <= 71)  return { r: 9, c: z - 53 };
  if (z >= 89 && z <= 103) return { r: 10, c: z - 85 };
  return { r: 1, c: 1 };
}

/**
 * Tentukan Tailwind class warna berdasarkan blok periodik
 */
export function getBlockColor(z: number, c: number, r: number): string {
  // Blok-p (termasuk H & He)
  if (z === 1 || z === 2 || (c >= 13 && c <= 18)) {
    return "bg-green-500/20 hover:bg-green-500/40 border-green-500/50 text-green-100";
  }
  // Blok-s
  if (c >= 1 && c <= 2) {
    return "bg-blue-500/20 hover:bg-blue-500/40 border-blue-500/50 text-blue-100";
  }
  // Blok-f (lantanida & aktinida)
  if (r === 9 || r === 10) {
    return "bg-purple-500/20 hover:bg-purple-500/40 border-purple-500/50 text-purple-100";
  }
  // Blok-d (logam transisi)
  return "bg-yellow-500/20 hover:bg-yellow-500/40 border-yellow-500/50 text-yellow-100";
}
