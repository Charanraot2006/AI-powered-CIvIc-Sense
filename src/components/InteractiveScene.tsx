'use client';

import { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Sphere, MeshDistortMaterial, Trail, Float, Sparkles } from '@react-three/drei';
import * as THREE from 'three';

function CoreNode() {
  const meshRef = useRef<THREE.Mesh>(null);

  useFrame((state: any) => {
    if (meshRef.current) {
      meshRef.current.rotation.x = state.clock.elapsedTime * 0.2;
      meshRef.current.rotation.y = state.clock.elapsedTime * 0.3;
    }
  });

  return (
    <Float speed={2} rotationIntensity={0.5} floatIntensity={1}>
      <Sphere ref={meshRef} args={[1.5, 64, 64]}>
        <MeshDistortMaterial 
          color="#10B981" 
          metalness={0.2}
          roughness={0.8}
          distort={0.4} 
          speed={2} 
          wireframe={true}
        />
      </Sphere>

      {/* Glowing inner core */}
      <Sphere args={[1.2, 32, 32]}>
        <meshStandardMaterial color="#059669" emissive="#10B981" emissiveIntensity={1} toneMapped={false} />
      </Sphere>
      
      {/* Surrounding data particles */}
      <Sparkles count={200} scale={6} size={4} speed={0.4} color="#3B82F6" />
    </Float>
  );
}

function OrbitingData() {
  const groupRef = useRef<THREE.Group>(null);
  
  const particles = useMemo(() => {
    return Array.from({ length: 15 }).map(() => ({
      position: [
        (Math.random() - 0.5) * 8,
        (Math.random() - 0.5) * 8,
        (Math.random() - 0.5) * 8
      ] as [number, number, number],
      speed: Math.random() * 0.5 + 0.1,
      radius: Math.random() * 2 + 2
    }));
  }, []);

  useFrame((state: any) => {
    if (groupRef.current) {
      groupRef.current.rotation.y = state.clock.elapsedTime * 0.1;
      groupRef.current.rotation.z = Math.sin(state.clock.elapsedTime * 0.05) * 0.2;
    }
  });

  return (
    <group ref={groupRef}>
      {particles.map((p, i) => (
        <Float key={i} speed={p.speed * 5} rotationIntensity={2} floatIntensity={2} position={p.position}>
          <Trail width={0.5} length={4} color={new THREE.Color('#3B82F6')} attenuation={(t: number) => t * t}>
            <Sphere args={[0.08, 16, 16]}>
              <meshBasicMaterial color="#3B82F6" toneMapped={false} />
            </Sphere>
          </Trail>
        </Float>
      ))}
    </group>
  );
}

export default function InteractiveScene() {
  return (
    <div style={{ width: '100%', height: '100%', position: 'absolute', top: 0, left: 0, zIndex: 0, pointerEvents: 'auto' }}>
      <Canvas camera={{ position: [0, 0, 8], fov: 45 }}>
        <ambientLight intensity={0.5} />
        <directionalLight position={[10, 10, 5]} intensity={2} color="#10B981" />
        <directionalLight position={[-10, -10, -5]} intensity={1} color="#3B82F6" />
        
        <CoreNode />
        <OrbitingData />
        
        <OrbitControls 
          enablePan={false} 
          enableZoom={false} 
          autoRotate 
          autoRotateSpeed={0.5} 
          maxPolarAngle={Math.PI / 1.5}
          minPolarAngle={Math.PI / 3}
        />
      </Canvas>
    </div>
  );
}
