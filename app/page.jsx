'use client';

import { Canvas } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import Rocket from "@/components/Rocket";
import { RocketScrollProvider, useRocketScroll } from './RocketScrollContext';
import { useRef } from "react";

// dots nav
  function ScrollIndicators() {
  const { scrollStage } = useRocketScroll();

  return (
    <div className="absolute right-8 top-1/2 transform -translate-y-1/2 flex flex-col gap-4 z-30">
      {[0, 1, 2, 3].map((stage) => (
        <button
          key={stage}
          onClick={() => window.dispatchEvent(new CustomEvent('rocketStageChange', { detail: stage }))}
          className={`w-4 h-4 rounded-full border-2 border-white transition-all duration-300 ${
            stage === scrollStage ? 'bg-white' : 'bg-transparent'
          }`}
        />
      ))}
    </div>
  );
}

export default function Home() {
  const controlsRef = useRef();

  return (
    <RocketScrollProvider>
      <main className="relative w-full h-screen bg-gradient-to-b from-sky-300 via-green-100 to-orange-200 text-white font-sans overflow-hidden">
        <ScrollIndicators />

        <div className="absolute inset-0 z-10">
          <Canvas camera={{ position: [0, 1.5, 6], fov: 45 }}>
            <ambientLight intensity={0.6} />
            <directionalLight position={[3, 5, 4]} intensity={1.2} />
            <Rocket controlsRef={controlsRef} />
            <OrbitControls ref={controlsRef} enableZoom={false} />
          </Canvas>

          <div className="absolute top-10 w-full text-center text-6xl font-bold tracking-wide text-white drop-shadow-xl z-20">
            3js test for rocked modelling
          </div>
        </div>
      </main>
    </RocketScrollProvider>
  );
}
