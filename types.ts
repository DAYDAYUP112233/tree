import * as THREE from 'three';

export enum TreeState {
  CHAOS = 'CHAOS',
  FORMED = 'FORMED',
}

export interface DualPosition {
  chaosPos: THREE.Vector3;
  targetPos: THREE.Vector3;
}

export interface FoliageUniforms {
  uTime: { value: number };
  uProgress: { value: number };
  uColor: { value: THREE.Color };
}

export interface OrnamentData {
  id: number;
  chaosPos: THREE.Vector3;
  targetPos: THREE.Vector3;
  scale: number;
  color: THREE.Color;
  speed: number; // Simulates weight
  rotationSpeed: number;
}