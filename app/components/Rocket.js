'use client'

import { useGLTF } from '@react-three/drei';
import { useRef, useEffect, useState } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';

export default function Rocket({ controlsRef }) {
  const { nodes } = useGLTF('/rocket.glb');
  const topRef = useRef();
  const midRef = useRef();
  const bottomRef = useRef();

  const { camera } = useThree();

  const [scrollStage, setScrollStage] = useState(0);

  const topY = useRef(0);
  const midY = useRef(0);
  const bottomY = useRef(0);
  const lookAtY = useRef(0);
  const cameraPos = useRef(new THREE.Vector3(0, 1.5, 6)); //default pos

  useEffect(() => {
    let scrollTimeout = null;
    //snapping
    const handleWheel = (e) => {
      if (scrollTimeout) return;
      setScrollStage((prev) => {
        const next = THREE.MathUtils.clamp(prev + Math.sign(e.deltaY), 0, 3);
        return next;
      });
      scrollTimeout = setTimeout(() => {
        scrollTimeout = null;
      }, 500);
    };

    const handleClickChange = (e) => {
      setScrollStage(e.detail);
    };

    window.addEventListener('wheel', handleWheel);
    window.addEventListener('rocketStageChange', handleClickChange);
    return () => {
      window.removeEventListener('wheel', handleWheel);
      window.removeEventListener('rocketStageChange', handleClickChange);
    };
  }, []);

useFrame(() => {
  let topTarget = 0, midTarget = 0, bottomTarget = 0, lookTarget = 0;

  if (scrollStage === 0) {
    topTarget = 0;
    midTarget = 0;
    bottomTarget = 0;
    lookTarget = 0.4;
  } else if (scrollStage === 1) {
    topTarget = 0.6;
    midTarget = 0.3;
    bottomTarget = 0.1;
    lookTarget = 1.5;
    cameraPos.current.set(1.2, 2.0, 5.0); //top-right tilt

  } else if (scrollStage === 2) {
    topTarget = 0.6;
    midTarget = 0.3;
    bottomTarget = 0.1;
    lookTarget = 0.3;
    cameraPos.current.set(-1.2, 2.0, 2); //close-left tilt

  } else if (scrollStage === 3) {
    topTarget = 0.6;
    midTarget = 0.3;
    bottomTarget = 0.1;
    lookTarget = -0.3;
    cameraPos.current.set(-5, 2.0, 4); //mid-more tilt

  }

  //smsooth transitiong
  topY.current = THREE.MathUtils.lerp(topY.current, topTarget, 0.1);
  midY.current = THREE.MathUtils.lerp(midY.current, midTarget, 0.1);
  bottomY.current = THREE.MathUtils.lerp(bottomY.current, bottomTarget, 0.1);
  lookAtY.current = THREE.MathUtils.lerp(lookAtY.current, lookTarget, 0.1);
  camera.position.lerp(cameraPos.current, 0.1);

  if (topRef.current) topRef.current.position.y = topY.current;
  if (midRef.current) midRef.current.position.y = midY.current;
  if (bottomRef.current) bottomRef.current.position.y = bottomY.current;

  // if (controlsRef?.current) {
  //   controlsRef.current.target.set(0, lookAtY.current, 0);
  //   controlsRef.current.update();
  // }
});


  return (
    <group scale={1.6} rotation={[0, 0.6, 0]}>
      <primitive object={nodes.top} ref={topRef} />
      <primitive object={nodes.mid} ref={midRef} />
      <primitive object={nodes.bottom} ref={bottomRef} />
    </group>
  );
}
