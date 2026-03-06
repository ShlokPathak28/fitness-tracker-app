'use client';

import { useRef, useMemo, useState, useEffect } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Float, Environment, Stars } from '@react-three/drei';
import * as THREE from 'three';
import { useTheme } from '@/context/ThemeContext';

// Realistic Dumbbell
function Dumbbell(props) {
  const meshRef = useRef();
  
  useFrame(() => {
    if (meshRef.current) {
      meshRef.current.rotation.x += 0.005;
      meshRef.current.rotation.y += 0.005;
    }
  });

  return (
    <Float speed={2} rotationIntensity={1.5} floatIntensity={1.5} {...props}>
      <group ref={meshRef}>
        {/* Handle */}
        <mesh rotation={[0, 0, Math.PI / 2]}>
          <cylinderGeometry args={[0.2, 0.2, 2, 32]} />
          <meshStandardMaterial color="#888" metalness={0.9} roughness={0.2} />
        </mesh>
        {/* Left Inner Weight */}
        <mesh position={[-0.8, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
          <cylinderGeometry args={[0.7, 0.7, 0.3, 32]} />
          <meshStandardMaterial color="#111" metalness={0.5} roughness={0.7} />
        </mesh>
        {/* Left Outer Weight */}
        <mesh position={[-1.2, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
          <cylinderGeometry args={[0.9, 0.9, 0.4, 32]} />
          <meshStandardMaterial color="#111" metalness={0.5} roughness={0.7} />
        </mesh>
        {/* Right Inner Weight */}
        <mesh position={[0.8, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
          <cylinderGeometry args={[0.7, 0.7, 0.3, 32]} />
          <meshStandardMaterial color="#111" metalness={0.5} roughness={0.7} />
        </mesh>
        {/* Right Outer Weight */}
        <mesh position={[1.2, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
          <cylinderGeometry args={[0.9, 0.9, 0.4, 32]} />
          <meshStandardMaterial color="#111" metalness={0.5} roughness={0.7} />
        </mesh>
      </group>
    </Float>
  );
}

// Realistic Kettlebell
function Kettlebell(props) {
  const meshRef = useRef();

  useFrame(() => {
    if (meshRef.current) {
      meshRef.current.rotation.x += 0.003;
      meshRef.current.rotation.y += 0.006;
    }
  });

  return (
    <Float speed={1.5} rotationIntensity={1.2} floatIntensity={1.5} {...props}>
      <group ref={meshRef}>
        {/* Body */}
        <mesh position={[0, -0.4, 0]}>
          <sphereGeometry args={[1.2, 32, 32]} />
          <meshStandardMaterial color="#111" metalness={0.5} roughness={0.7} />
        </mesh>
        {/* Flat Bottom */}
        <mesh position={[0, -1.4, 0]}>
          <cylinderGeometry args={[0.8, 0.9, 0.2, 32]} />
          <meshStandardMaterial color="#111" metalness={0.5} roughness={0.7} />
        </mesh>
        {/* Handle */}
        <mesh position={[0, 0.6, 0]}>
          <torusGeometry args={[0.8, 0.2, 16, 64, Math.PI]} />
          <meshStandardMaterial color="#777" metalness={0.8} roughness={0.3} />
        </mesh>
      </group>
    </Float>
  );
}

// Abstract Network Nodes (Colors react to theme)
function NetworkNodes({ isDark }) {
  const pointsRef = useRef();
  
  const [positions, colors] = useMemo(() => {
    const count = 300;
    const pos = new Float32Array(count * 3);
    const col = new Float32Array(count * 3);
    
    // Use darker colors for light mode to ensure visibility
    const colorOpts = isDark 
      ? [new THREE.Color('#6366f1'), new THREE.Color('#10b981'), new THREE.Color('#ec4899'), new THREE.Color('#fff')]
      : [new THREE.Color('#312e81'), new THREE.Color('#064e3b'), new THREE.Color('#831843'), new THREE.Color('#475569')];
    
    for (let i = 0; i < count; i++) {
      const radius = 10 + Math.random() * 30;
      const theta = Math.random() * 2 * Math.PI;
      const phi = Math.acos(Math.random() * 2 - 1);
      
      pos[i * 3] = radius * Math.sin(phi) * Math.cos(theta);
      pos[i * 3 + 1] = radius * Math.sin(phi) * Math.sin(theta);
      pos[i * 3 + 2] = radius * Math.cos(phi);
      
      const c = colorOpts[Math.floor(Math.random() * colorOpts.length)];
      col[i * 3] = c.r;
      col[i * 3 + 1] = c.g;
      col[i * 3 + 2] = c.b;
    }
    return [pos, col];
  }, [isDark]);

  useFrame((state, delta) => {
    if (pointsRef.current) {
      pointsRef.current.rotation.y -= delta * 0.05;
      pointsRef.current.rotation.x += delta * 0.02;
    }
  });

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" count={positions.length / 3} array={positions} itemSize={3} />
        <bufferAttribute attach="attributes-color" count={colors.length / 3} array={colors} itemSize={3} />
      </bufferGeometry>
      <pointsMaterial size={isDark ? 0.15 : 0.2} vertexColors transparent opacity={isDark ? 0.8 : 0.6} sizeAttenuation />
    </points>
  );
}

// Global Scroll Listener to Parallax Camera
function ScrollReactiveCamera() {
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    // Initial call
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useFrame((state) => {
    // Parallax effect: Moving 1000px down on page moves camera 12 units Y, and -5 units Z
    const targetY = -(scrollY * 0.012);
    const targetZ = 8 - (scrollY * 0.005);
    
    state.camera.position.y = THREE.MathUtils.lerp(state.camera.position.y, targetY, 0.05);
    state.camera.position.z = THREE.MathUtils.lerp(state.camera.position.z, targetZ, 0.05);

    // Make the camera look slightly down as we scroll
    state.camera.lookAt(0, targetY - 2, 0);
  });
  
  return null;
}

// Inner Scene that leverages the isDark prop
function SceneContents({ isDark }) {
  return (
    <>
      <ScrollReactiveCamera />
      
      {/* Lighting adjusted for theme */}
      <ambientLight intensity={isDark ? 0.5 : 1.5} />
      <directionalLight position={[10, 10, 5]} intensity={isDark ? 1.5 : 2.5} color="#ffffff" />
      <directionalLight position={[-10, -10, -5]} intensity={0.8} color="#6366f1" />
      
      {/* Background Particles */}
      <NetworkNodes isDark={isDark} />
      
      {/* Render stars only in dark mode, or fainter in light mode */}
      {isDark && <Stars radius={50} depth={50} count={2000} factor={4} saturation={1} fade speed={1} />}

      {/* Realistic Gym Equipment */}
      <Dumbbell position={[-5, 2, -5]} scale={1.2} rotation={[0.4, 0.2, 0]} />
      <Kettlebell position={[6, -2, -8]} scale={1.5} rotation={[-0.2, 0.5, 0]} />
      <Dumbbell position={[4, -12, -10]} scale={1.8} rotation={[1, -0.5, 0.5]} />
      <Kettlebell position={[-6, -18, -12]} scale={2} rotation={[0, 2, 0]} />

      <Environment preset="city" />
    </>
  );
}

export default function Scene() {
  const { theme } = useTheme();
  // If theme is undefined (ssr), default to dark safely.
  const isDark = theme !== 'light';

  return (
    <div style={{ position: 'absolute', top: 0, left: 0, width: '100vw', height: '100vh', pointerEvents: 'none' }}>
      <Canvas camera={{ position: [0, 0, 8], fov: 45 }} dpr={[1, 2]}>
        <SceneContents isDark={isDark} />
      </Canvas>
    </div>
  );
}
