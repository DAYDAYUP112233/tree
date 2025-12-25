import React from 'react';
import { PerspectiveCamera, OrbitControls, Environment, Float } from '@react-three/drei';
import { EffectComposer, Bloom, Vignette, Noise } from '@react-three/postprocessing';
import { Foliage } from './Foliage';
import { Ornaments } from './Ornaments';
import { TreeState } from '../types';
import { CONFIG } from '../constants';

interface ExperienceProps {
  treeState: TreeState;
}

export const Experience: React.FC<ExperienceProps> = ({ treeState }) => {
  return (
    <>
      {/* Camera Setup */}
      <PerspectiveCamera makeDefault position={[0, 2, 25]} fov={45} />
      <OrbitControls 
        enablePan={false} 
        minPolarAngle={Math.PI / 3} 
        maxPolarAngle={Math.PI / 1.8}
        minDistance={10}
        maxDistance={40}
        autoRotate={treeState === TreeState.FORMED}
        autoRotateSpeed={0.5}
      />

      {/* Lighting - Natural & Festive */}
      <ambientLight intensity={0.4} color="#102030" />
      
      {/* Warm Main Light (Simulating indoor fire or warm ambient) */}
      <spotLight 
        position={[10, 20, 10]} 
        angle={0.3} 
        penumbra={0.5} 
        intensity={150} 
        color="#fff1e0" 
        castShadow 
      />
      
      {/* Cool Rim Light (Moonlight/Winter feeling) */}
      <spotLight 
        position={[-10, 5, 10]} 
        angle={0.5} 
        penumbra={1} 
        intensity={80} 
        color="#cceeff" 
      />
      
      {/* Backlight for depth */}
      <pointLight position={[0, 10, -10]} intensity={40} color="#ffffff" />

      {/* Environment for reflections */}
      <Environment preset="night" environmentIntensity={0.7} />

      {/* The Content */}
      <group position={[0, 0, 0]}>
        {/* Floating motion for the whole tree when formed */}
        <Float speed={2} rotationIntensity={0.1} floatIntensity={0.2} enabled={treeState === TreeState.FORMED}>
           <Foliage state={treeState} />
           <Ornaments state={treeState} type="sphere" count={CONFIG.ORNAMENT_COUNT} />
           <Ornaments state={treeState} type="box" count={CONFIG.GIFT_COUNT} />
        </Float>
      </group>

      {/* Post Processing */}
      <EffectComposer disableNormalPass>
        {/* Softer Bloom */}
        <Bloom 
          luminanceThreshold={0.8} 
          mipmapBlur 
          intensity={0.8} 
          radius={0.4}
        />
        <Vignette eskil={false} offset={0.1} darkness={0.5} />
        <Noise opacity={0.02} /> 
      </EffectComposer>
    </>
  );
};