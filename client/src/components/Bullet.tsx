import { useRef, useEffect } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

interface BulletProps {
  id: string;
  initialPosition: THREE.Vector3;
  direction: THREE.Vector3;
  onHit: (id: string, position: THREE.Vector3) => void;
  onExpire: (id: string) => void;
  playerPosition?: THREE.Vector3;
  enemyPositions?: THREE.Vector3[];
  isPlayerBullet?: boolean;
}

export default function Bullet({ id, initialPosition, direction, onHit, onExpire, playerPosition, enemyPositions, isPlayerBullet }: BulletProps) {
  const meshRef = useRef<THREE.Mesh>(null);
  const startTime = useRef(Date.now());
  const BULLET_SPEED = 100;
  const BULLET_LIFETIME = 3000; // 3 seconds
  const HIT_RADIUS = 8; // Further increased for better collision detection

  useEffect(() => {
    if (meshRef.current) {
      meshRef.current.position.copy(initialPosition);
    }
  }, [initialPosition]);

  useFrame((state, delta) => {
    if (!meshRef.current) return;

    // Move bullet
    const movement = direction.clone().multiplyScalar(BULLET_SPEED * delta);
    meshRef.current.position.add(movement);

    // Check lifetime
    if (Date.now() - startTime.current > BULLET_LIFETIME) {
      onExpire(id);
      return;
    }

    // Aircraft collision detection
    if (isPlayerBullet && enemyPositions && enemyPositions.length > 0) {
      // Player bullet checking for enemy hits
      for (let i = 0; i < enemyPositions.length; i++) {
        const enemyPos = enemyPositions[i];
        if (enemyPos) {
          const distance = meshRef.current.position.distanceTo(enemyPos);
          console.log(`Player bullet ${id} checking enemy ${i} at distance ${distance.toFixed(2)}`);
          if (distance < HIT_RADIUS) {
            console.log(`🎯 Player bullet ${id} HIT enemy ${i} at distance ${distance.toFixed(2)}!`);
            onHit(id, meshRef.current.position.clone());
            return;
          }
        }
      }
    } else if (!isPlayerBullet && playerPosition) {
      // Enemy bullet checking for player hit
      const distance = meshRef.current.position.distanceTo(playerPosition);
      if (distance < HIT_RADIUS) {
        console.log(`💥 Enemy bullet ${id} HIT player at distance ${distance.toFixed(2)}!`);
        onHit(id, meshRef.current.position.clone());
        return;
      }
    }

    // Simple collision detection with ground - expire instead of hit
    if (meshRef.current.position.y <= 0) {
      onExpire(id);
      return;
    }

    // Check bounds (remove bullets that go too far)
    const distance = meshRef.current.position.length();
    if (distance > 500) {
      onExpire(id);
      return;
    }
  });

  return (
    <mesh ref={meshRef}>
      <sphereGeometry args={[0.5, 8, 8]} />
      <meshLambertMaterial 
        color="#FFD700" 
        emissive="#FF4500" 
        emissiveIntensity={0.8}
      />
    </mesh>
  );
}
