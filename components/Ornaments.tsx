import React, { useMemo, useRef, useState, useLayoutEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { CONFIG, COLORS, getRandomSpherePoint, getTreePoint } from '../constants';
import { TreeState, OrnamentData } from '../types';

interface OrnamentsProps {
  state: TreeState;
  type: 'sphere' | 'box';
  count: number;
}

export const Ornaments: React.FC<OrnamentsProps> = ({ state, type, count }) => {
  const meshRef = useRef<THREE.InstancedMesh>(null);
  const [targetProgress] = useState({ value: 0 }); // Local state to track transition direction

  // Generate data for each instance
  const data = useMemo<OrnamentData[]>(() => {
    const temp: OrnamentData[] = [];
    for (let i = 0; i < count; i++) {
      // Gifts are at bottom, ornaments distributed
      const isBox = type === 'box';
      const tPos = isBox 
        ? getTreePoint(2, CONFIG.TREE_RADIUS, -CONFIG.TREE_HEIGHT/2 + 1) // Base of tree
        : getTreePoint(CONFIG.TREE_HEIGHT * 0.9, CONFIG.TREE_RADIUS * 0.9); // All over

      // Ensure ornaments are on surface
      if (!isBox) {
        // Push slightly out to sit on leaves
         tPos.x *= 1.1; 
         tPos.z *= 1.1;
      }

      // Traditional Christmas Palette Distribution
      let color;
      const rand = Math.random();
      
      if (rand > 0.66) color = COLORS.RED_LUXURY; // 33% Red
      else if (rand > 0.33) color = COLORS.GOLD_HIGH; // 33% Gold
      else color = COLORS.SILVER; // 33% Silver

      if (Math.random() > 0.9) color = COLORS.WARM_WHITE; // Occasional lights

      // Weight simulation: Boxes are heavy (slow), Lights are light (fast)
      const speed = isBox ? 0.8 + Math.random() * 0.5 : 1.5 + Math.random() * 1.5;
      
      temp.push({
        id: i,
        chaosPos: getRandomSpherePoint(CONFIG.CHAOS_RADIUS * 1.2),
        targetPos: tPos,
        scale: isBox ? 0.4 + Math.random() * 0.4 : 0.2 + Math.random() * 0.2,
        color: color,
        speed: speed,
        rotationSpeed: (Math.random() - 0.5) * 2,
      });
    }
    return temp;
  }, [count, type]);

  // Set initial colors
  useLayoutEffect(() => {
    if (meshRef.current) {
      const tempColor = new THREE.Color();
      data.forEach((d, i) => {
        meshRef.current!.setColorAt(i, d.color);
      });
      meshRef.current.instanceColor!.needsUpdate = true;
    }
  }, [data]);

  const dummy = useMemo(() => new THREE.Object3D(), []);

  // Refined Frame Loop using a persistent position buffer
  const currentPositions = useMemo(() => {
    return data.map(d => d.chaosPos.clone());
  }, [data]);

  useFrame((stateObj, delta) => {
    if (!meshRef.current) return;
    
    const isForming = state === TreeState.FORMED;
    
    data.forEach((d, i) => {
      const target = isForming ? d.targetPos : d.chaosPos;
      const current = currentPositions[i];
      
      // Lerp logic with weight (speed)
      // Heavier objects (low speed) move slower
      const step = delta * d.speed; 
      
      current.lerp(target, step); // Simple linear approach, looks acceptable for "magic"
      
      dummy.position.copy(current);
      
      // Add rotation
      dummy.rotation.x += delta * d.rotationSpeed;
      dummy.rotation.y += delta * d.rotationSpeed;
      
      dummy.scale.setScalar(d.scale);
      
      dummy.updateMatrix();
      meshRef.current!.setMatrixAt(i, dummy.matrix);
    });
    
    meshRef.current.instanceMatrix.needsUpdate = true;
  });

  return (
    <instancedMesh
      ref={meshRef}
      args={[undefined, undefined, count]}
      castShadow
      receiveShadow
    >
      {type === 'box' ? <boxGeometry /> : <sphereGeometry args={[1, 16, 16]} />}
      <meshStandardMaterial 
        roughness={0.2} 
        metalness={0.8} 
        emissive={COLORS.GOLD_DEEP}
        emissiveIntensity={0.1}
      />
    </instancedMesh>
  );
};