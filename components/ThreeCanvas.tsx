'use client';

import { useRef, useEffect, useState } from 'react';
import { useAtomStore } from '@/hooks/useAtomStore';
import { useThreeJS } from '@/hooks/useThreeJS';

export default function ThreeCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { buildAtom, setAnimSpeed } = useThreeJS(canvasRef);
  const selectedAtom = useAtomStore((s) => s.selectedAtom);
  const animSpeed = useAtomStore((s) => s.animSpeed);
  const [hasMounted, setHasMounted] = useState(false);

  useEffect(() => {
    setHasMounted(true);
    console.log("ThreeCanvas: Component Mounted");
  }, []);

  // Sinkronkan kecepatan animasi dengan slider
  useEffect(() => {
    if (hasMounted) setAnimSpeed(animSpeed);
  }, [animSpeed, setAnimSpeed, hasMounted]);

  // Rebuild atom 3D setiap kali atom berubah
  useEffect(() => {
    if (hasMounted && selectedAtom) {
      console.log("ThreeCanvas: selectedAtom changed, calling buildAtom", selectedAtom.name);
      buildAtom(selectedAtom);
    }
  }, [selectedAtom, buildAtom, hasMounted]);

  if (!hasMounted) return <div className="absolute inset-0 bg-slate-900" />;

  return (
    <canvas
      ref={canvasRef}
      id="renderCanvas"
      className="absolute inset-0 w-full h-full outline-none touch-none z-0"
      style={{ display: 'block' }}
    />
  );
}
