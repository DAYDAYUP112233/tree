import * as THREE from 'three';

export const COLORS = {
  // Classic Forest/Pine Green
  EMERALD_DEEP: new THREE.Color('#1a472a'), 
  EMERALD_LIGHT: new THREE.Color('#2d6a4f'),
  
  // Traditional Christmas Colors
  GOLD_HIGH: new THREE.Color('#FFD700'),
  GOLD_DEEP: new THREE.Color('#DAA520'),
  RED_LUXURY: new THREE.Color('#D42426'), // Classic Bright Red
  SILVER: new THREE.Color('#E5E4E2'),
  WARM_WHITE: new THREE.Color('#FFFEF0'),
  
  // Night Sky
  BACKGROUND: '#0b1015'
};

export const CONFIG = {
  FOLIAGE_COUNT: 15000,
  ORNAMENT_COUNT: 400,
  GIFT_COUNT: 50,
  TREE_HEIGHT: 12,
  TREE_RADIUS: 4.5,
  CHAOS_RADIUS: 15,
};

// Helper to generate random point in sphere
export const getRandomSpherePoint = (radius: number): THREE.Vector3 => {
  const u = Math.random();
  const v = Math.random();
  const theta = 2 * Math.PI * u;
  const phi = Math.acos(2 * v - 1);
  const r = Math.cbrt(Math.random()) * radius;
  
  const sinPhi = Math.sin(phi);
  const x = r * sinPhi * Math.cos(theta);
  const y = r * sinPhi * Math.sin(theta);
  const z = r * Math.cos(phi);
  return new THREE.Vector3(x, y, z);
};

// Helper to generate point on a cone (tree shape)
export const getTreePoint = (height: number, baseRadius: number, biasY: number = 0): THREE.Vector3 => {
  const y = Math.random() * height; // 0 to height
  const radiusAtY = ((height - y) / height) * baseRadius;
  
  // Spiral distribution for more natural look
  const angle = Math.random() * Math.PI * 2;
  // Push points slightly outwards or fill volume
  const r = Math.sqrt(Math.random()) * radiusAtY; 

  const x = r * Math.cos(angle);
  const z = r * Math.sin(angle);
  
  return new THREE.Vector3(x, y - (height/2) + biasY, z);
};