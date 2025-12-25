import React, { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { CONFIG, COLORS, getRandomSpherePoint, getTreePoint } from '../constants';
import { TreeState, FoliageUniforms } from '../types';

// Custom Shader Material for performance and "Glitter" effect
const FoliageShaderMaterial = {
  vertexShader: `
    uniform float uTime;
    uniform float uProgress;
    attribute vec3 aChaosPos;
    attribute vec3 aTargetPos;
    attribute float aRandom;
    
    varying vec2 vUv;
    varying float vRandom;
    varying float vHeight;

    // Cubic easing for smooth transition
    float easeInOutCubic(float x) {
      return x < 0.5 ? 4.0 * x * x * x : 1.0 - pow(-2.0 * x + 2.0, 3.0) / 2.0;
    }

    void main() {
      vUv = uv;
      vRandom = aRandom;
      
      // Interpolate position based on state progress
      float easeProgress = easeInOutCubic(uProgress);
      vec3 pos = mix(aChaosPos, aTargetPos, easeProgress);
      
      // Add subtle wind movement when formed
      if (uProgress > 0.8) {
        float wind = sin(uTime * 2.0 + pos.y * 0.5) * 0.1;
        pos.x += wind;
        pos.z += wind * 0.5;
      }

      vHeight = pos.y;

      vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);
      
      // Scale particles based on depth and randomness
      gl_PointSize = (4.0 * aRandom + 2.0) * (20.0 / -mvPosition.z);
      gl_Position = projectionMatrix * mvPosition;
    }
  `,
  fragmentShader: `
    uniform vec3 uColor;
    uniform float uTime;
    varying float vRandom;
    varying float vHeight;

    void main() {
      // Circular particle
      vec2 coord = gl_PointCoord - vec2(0.5);
      if(length(coord) > 0.5) discard;

      // Base Forest Green
      vec3 finalColor = uColor;

      // Add gradients based on height (darker at bottom)
      finalColor *= 0.6 + 0.4 * (vHeight + 5.0) / 10.0;

      // Snow / Frost sparkles (White/Silver instead of Gold)
      float sparkle = sin(uTime * 3.0 + vRandom * 100.0);
      if (sparkle > 0.92) {
        finalColor = mix(finalColor, vec3(1.0, 1.0, 1.0), 0.9); // White frost flash
      }

      gl_FragColor = vec4(finalColor, 1.0);
    }
  `
};

interface FoliageProps {
  state: TreeState;
}

export const Foliage: React.FC<FoliageProps> = ({ state }) => {
  const shaderRef = useRef<THREE.ShaderMaterial>(null);
  
  // Generate geometry data once
  const { chaosPositions, targetPositions, randoms } = useMemo(() => {
    const chaos = new Float32Array(CONFIG.FOLIAGE_COUNT * 3);
    const target = new Float32Array(CONFIG.FOLIAGE_COUNT * 3);
    const rnd = new Float32Array(CONFIG.FOLIAGE_COUNT);

    for (let i = 0; i < CONFIG.FOLIAGE_COUNT; i++) {
      const cPos = getRandomSpherePoint(CONFIG.CHAOS_RADIUS);
      const tPos = getTreePoint(CONFIG.TREE_HEIGHT, CONFIG.TREE_RADIUS);

      chaos[i * 3] = cPos.x;
      chaos[i * 3 + 1] = cPos.y;
      chaos[i * 3 + 2] = cPos.z;

      target[i * 3] = tPos.x;
      target[i * 3 + 1] = tPos.y;
      target[i * 3 + 2] = tPos.z;

      rnd[i] = Math.random();
    }

    return { chaosPositions: chaos, targetPositions: target, randoms: rnd };
  }, []);

  const uniforms = useMemo<FoliageUniforms>(() => ({
    uTime: { value: 0 },
    uProgress: { value: 0 },
    uColor: { value: COLORS.EMERALD_DEEP },
  }), []);

  useFrame((stateObj, delta) => {
    if (shaderRef.current) {
      shaderRef.current.uniforms.uTime.value += delta;
      
      const targetProgress = state === TreeState.FORMED ? 1 : 0;
      // Smooth lerp for the global progress uniform
      shaderRef.current.uniforms.uProgress.value = THREE.MathUtils.lerp(
        shaderRef.current.uniforms.uProgress.value,
        targetProgress,
        delta * 0.8 // Speed of transition
      );
    }
  });

  return (
    <points>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position" // Dummy position, actual used in shader
          count={CONFIG.FOLIAGE_COUNT}
          array={chaosPositions}
          itemSize={3}
        />
        <bufferAttribute
          attach="attributes-aChaosPos"
          count={CONFIG.FOLIAGE_COUNT}
          array={chaosPositions}
          itemSize={3}
        />
        <bufferAttribute
          attach="attributes-aTargetPos"
          count={CONFIG.FOLIAGE_COUNT}
          array={targetPositions}
          itemSize={3}
        />
        <bufferAttribute
          attach="attributes-aRandom"
          count={CONFIG.FOLIAGE_COUNT}
          array={randoms}
          itemSize={1}
        />
      </bufferGeometry>
      <shaderMaterial
        ref={shaderRef}
        vertexShader={FoliageShaderMaterial.vertexShader}
        fragmentShader={FoliageShaderMaterial.fragmentShader}
        uniforms={uniforms}
        transparent={true}
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
};