import { useTexture } from "@react-three/drei";
import * as THREE from "three";

export default function Environment() {
  const skyTexture = useTexture("/textures/sky.png");
  const grassTexture = useTexture("/textures/grass.png");

  // Configure grass texture
  grassTexture.wrapS = grassTexture.wrapT = THREE.RepeatWrapping;
  grassTexture.repeat.set(50, 50);

  return (
    <>
      {/* Sky dome */}
      <mesh>
        <sphereGeometry args={[800, 32, 32]} />
        <meshBasicMaterial 
          map={skyTexture}
          side={THREE.BackSide}
          color="#87CEEB"
        />
      </mesh>

      {/* Ground plane */}
      <mesh position={[0, -50, 0]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <planeGeometry args={[1000, 1000]} />
        <meshLambertMaterial 
          map={grassTexture}
          color="#228B22"
        />
      </mesh>

      {/* Clouds */}
      {Array.from({ length: 20 }, (_, i) => {
        const x = (Math.random() - 0.5) * 800;
        const y = Math.random() * 100 + 50;
        const z = (Math.random() - 0.5) * 800;
        const scale = Math.random() * 3 + 2;

        return (
          <mesh key={i} position={[x, y, z]} scale={[scale, scale * 0.6, scale]}>
            <sphereGeometry args={[10, 8, 8]} />
            <meshLambertMaterial 
              color="white" 
              transparent 
              opacity={0.8}
            />
          </mesh>
        );
      })}

      {/* Mountains in distance */}
      {Array.from({ length: 8 }, (_, i) => {
        const angle = (i / 8) * Math.PI * 2;
        const x = Math.cos(angle) * 400;
        const z = Math.sin(angle) * 400;
        const height = Math.random() * 100 + 50;

        return (
          <mesh key={`mountain-${i}`} position={[x, height / 2 - 50, z]}>
            <coneGeometry args={[30, height, 8]} />
            <meshLambertMaterial color="#8B7355" />
          </mesh>
        );
      })}
    </>
  );
}
