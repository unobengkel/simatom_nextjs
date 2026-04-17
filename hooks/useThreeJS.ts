// ============================================================
// hooks/useThreeJS.ts — Three.js lifecycle hook untuk SIMATOM
// ============================================================
'use client';

import { useEffect, useRef, useCallback } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import type { ElementData } from '@/lib/atomTypes';

export function useThreeJS(canvasRef: React.RefObject<HTMLCanvasElement | null>) {
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const controlsRef = useRef<OrbitControls | null>(null);
  const atomGroupRef = useRef<THREE.Group | null>(null);
  const electronsListRef = useRef<{ pivot: THREE.Group; speed: number }[]>([]);
  const nucleusNodesRef = useRef<{ mesh: THREE.Mesh; basePos: THREE.Vector3 }[]>([]);
  const animSpeedRef = useRef<number>(1);
  const timeObjRef = useRef<number>(0);
  const rafRef = useRef<number>(0);
  const isInitializedRef = useRef<boolean>(false);

  const setAnimSpeed = useCallback((speed: number) => {
    animSpeedRef.current = speed;
  }, []);

  const init = useCallback(() => {
    if (!canvasRef.current || isInitializedRef.current) return;

    try {
      console.log("useThreeJS: Initializing Three.js context...");
      const canvas = canvasRef.current;
      const scene = new THREE.Scene();
      scene.background = new THREE.Color(0x020617);

      const camera = new THREE.PerspectiveCamera(
        45,
        window.innerWidth / window.innerHeight,
        0.1,
        2000
      );
      camera.position.set(0, 50, 150);

      let renderer: THREE.WebGLRenderer;
      try {
        renderer = new THREE.WebGLRenderer({ 
          canvas: canvas!, 
          antialias: true,
          alpha: true,
          preserveDrawingBuffer: true
        });
        console.log("useThreeJS: WebGLRenderer created successfully");
      } catch (e) {
        console.warn("useThreeJS: WebGL Context creation failed, retrying with minimal settings", e);
        renderer = new THREE.WebGLRenderer({ 
          canvas: canvas!, 
          antialias: false 
        });
      }

      renderer.setSize(window.innerWidth, window.innerHeight);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

      const controls = new OrbitControls(camera, renderer.domElement);
      controls.enableDamping = true;
      controls.dampingFactor = 0.05;

      scene.add(new THREE.AmbientLight(0xffffff, 0.7));
      const pointLight = new THREE.PointLight(0xffffff, 1.0);
      pointLight.position.set(50, 50, 50);
      scene.add(pointLight);

      // Debug: Tambahkan kotak merah sementara untuk memastikan rendering jalan
      const debugBox = new THREE.Mesh(
        new THREE.BoxGeometry(5, 5, 5),
        new THREE.MeshBasicMaterial({ color: 0xff0000 })
      );
      debugBox.position.set(0, -20, 0);
      scene.add(debugBox);

      const atomGroup = new THREE.Group();
      scene.add(atomGroup);

      sceneRef.current = scene;
      cameraRef.current = camera;
      rendererRef.current = renderer;
      controlsRef.current = controls;
      atomGroupRef.current = atomGroup;

      const handleResize = () => {
        if (cameraRef.current && rendererRef.current) {
          const w = window.innerWidth;
          const h = window.innerHeight;
          cameraRef.current.aspect = w / h;
          cameraRef.current.updateProjectionMatrix();
          rendererRef.current.setSize(w, h);
        }
      };
      window.addEventListener('resize', handleResize);

      const animate = () => {
        rafRef.current = requestAnimationFrame(animate);
        const speed = animSpeedRef.current;
        timeObjRef.current += 0.05 * speed;

        if (atomGroupRef.current && controlsRef.current && rendererRef.current && sceneRef.current && cameraRef.current) {
          atomGroupRef.current.rotation.y += 0.002 * speed;
          atomGroupRef.current.rotation.x += 0.001 * speed;
          
          electronsListRef.current.forEach((el) => {
            el.pivot.rotation.z += el.speed * speed;
          });
          
          const pulse = 1 + Math.sin(timeObjRef.current * 2) * 0.03;
          nucleusNodesRef.current.forEach((node) => {
            node.mesh.position.copy(node.basePos).multiplyScalar(pulse);
          });
          
          controlsRef.current.update();
          rendererRef.current.render(sceneRef.current, cameraRef.current);
        }
      };

      animate();
      isInitializedRef.current = true;
      console.log("useThreeJS: Animation loop started");

      return () => {
        window.removeEventListener('resize', handleResize);
        if (rafRef.current) cancelAnimationFrame(rafRef.current);
        if (rendererRef.current) {
          rendererRef.current.dispose();
          rendererRef.current.forceContextLoss();
        }
      };
    } catch (err) {
      console.error("useThreeJS: Critical failure in init():", err);
    }
  }, [canvasRef]);

  const buildAtom = useCallback((data: ElementData) => {
    console.log(`useThreeJS: Building atom ${data.name} (Z=${data.z})...`);
    
    if (!isInitializedRef.current) {
      console.log("useThreeJS: buildAtom triggered auto-init because not initialized yet.");
      init();
    }
    
    if (!sceneRef.current || !cameraRef.current || !controlsRef.current || !atomGroupRef.current) {
      console.warn("useThreeJS: Cannot build atom, refs are missing.", {
        scene: !!sceneRef.current,
        camera: !!cameraRef.current,
        atomGroup: !!atomGroupRef.current
      });
      return;
    }

    const scene = sceneRef.current;
    const camera = cameraRef.current;
    const controls = controlsRef.current;
    const atomGroupOld = atomGroupRef.current;

    scene.remove(atomGroupOld);
    const atomGroup = new THREE.Group();
    scene.add(atomGroup);
    atomGroupRef.current = atomGroup;
    electronsListRef.current = [];
    nucleusNodesRef.current = [];

    const totalNucleons = data.p + data.n;
    if (isNaN(totalNucleons)) {
      console.error("useThreeJS: totalNucleons is NaN for raw data", data);
      return;
    }

    let sphereSegments = 24;
    let nucleonSize = 1.2;
    if (totalNucleons > 50)  { sphereSegments = 16; nucleonSize = 0.9; }
    if (totalNucleons > 150) { sphereSegments = 10; nucleonSize = 0.7; }

    const clusterRadius = Math.cbrt(totalNucleons) * nucleonSize * 0.45;

    const matProton  = new THREE.MeshPhongMaterial({ color: 0xef4444, shininess: 80 });
    const matNeutron = new THREE.MeshPhongMaterial({ color: 0x94a3b8, shininess: 50 });
    const matElectron = new THREE.MeshPhongMaterial({ color: 0xfacc15, emissive: 0x8a6a04, shininess: 100 });
    const matOrbit   = new THREE.MeshBasicMaterial({ color: 0x38bdf8, transparent: true, opacity: 0.15, wireframe: true });

    const geoNucleon  = new THREE.SphereGeometry(nucleonSize, sphereSegments, sphereSegments);
    const geoElectron = new THREE.SphereGeometry(0.6, 12, 12);

    let pCount = 0, nCount = 0;
    for (let i = 0; i < totalNucleons; i++) {
      const phi   = Math.acos(1 - 2 * (i + 0.5) / totalNucleons);
      const theta = Math.PI * (1 + Math.sqrt(5)) * i;
      const r     = clusterRadius * (0.8 + Math.random() * 0.3);
      const x     = r * Math.sin(phi) * Math.cos(theta);
      const y     = r * Math.sin(phi) * Math.sin(theta);
      const zPos  = r * Math.cos(phi);

      const isProton = (pCount < data.p && Math.random() > 0.5) || nCount >= data.n;
      const mesh = new THREE.Mesh(geoNucleon, isProton ? matProton : matNeutron);
      mesh.position.set(x, y, zPos);
      atomGroup.add(mesh);
      if (isProton) pCount++; else nCount++;

      nucleusNodesRef.current.push({ mesh, basePos: new THREE.Vector3(x, y, zPos) });
    }

    let currentRadius = clusterRadius + (totalNucleons > 50 ? 5 : 3);
    data.config.forEach((numElectrons, shellIndex) => {
      const thickness = totalNucleons > 100 ? 0.03 : 0.08;
      const geoOrbit = new THREE.TorusGeometry(currentRadius, thickness, 4, 64);
      const orbit = new THREE.Mesh(geoOrbit, matOrbit);
      if (data.z > 2) {
        orbit.rotation.x = Math.random() * Math.PI;
        orbit.rotation.y = Math.random() * Math.PI;
      }
      atomGroup.add(orbit);

      const baseSpeed = 0.025 / (shellIndex + 1);
      for (let e = 0; e < numElectrons; e++) {
        const elMesh = new THREE.Mesh(geoElectron, matElectron);
        elMesh.position.x = currentRadius;
        const pivot = new THREE.Group();
        pivot.add(elMesh);
        orbit.add(pivot);
        pivot.rotation.z = ((Math.PI * 2) / numElectrons) * e;
        electronsListRef.current.push({ pivot, speed: baseSpeed * (0.8 + Math.random() * 0.4) });
      }
      currentRadius += 3.5 + shellIndex * 0.4;
    });

    const camDist = currentRadius * 2.5;
    camera.position.set(0, currentRadius * 0.8, camDist);
    camera.lookAt(0, 0, 0);
    controls.minDistance = clusterRadius * 2;
    controls.maxDistance = camDist * 3;
    controls.target.set(0, 0, 0);
    controls.update();
    console.log("useThreeJS: buildAtom complete.");
  }, [init]);

  useEffect(() => {
    const cleanup = init();
    return () => {
      if (cleanup) cleanup();
    };
  }, [init]);

  return { buildAtom, setAnimSpeed };
}
