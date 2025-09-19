import { useRef, useEffect } from "react";
import { useFrame } from "@react-three/fiber";
import { useKeyboardControls, Text } from "@react-three/drei";
import * as THREE from "three";
import { useFlightGame } from "@/lib/stores/useFlightGame";
import { applyFlightPhysics } from "@/lib/flightPhysics";
import { nflTeams } from "@/lib/nflTeams";

interface AircraftProps {
  isPlayer?: boolean;
  teamId: string;
  position?: [number, number, number];
  onShoot?: (position: THREE.Vector3, direction: THREE.Vector3) => void;
}

export default function Aircraft({ isPlayer = false, teamId, position = [0, 0, 0], onShoot }: AircraftProps) {
  const meshRef = useRef<THREE.Group>(null);
  const [, getControls] = useKeyboardControls();
  const { updatePlayerState, playerState, enemyAircraft, damageAircraft } = useFlightGame();
  
  const team = nflTeams.find(t => t.id === teamId);
  const velocity = useRef(new THREE.Vector3());
  const lastShootTime = useRef(0);

  useEffect(() => {
    if (meshRef.current && !isPlayer) {
      meshRef.current.position.set(...position);
    }
  }, [position, isPlayer]);

  useFrame((state, delta) => {
    if (!meshRef.current) return;

    if (isPlayer) {
      // Player aircraft physics
      const controls = getControls();
      const flightControls = {
        throttleUp: controls.throttleUp || false,
        throttleDown: controls.throttleDown || false,
        pitchUp: controls.pitchUp || false,
        pitchDown: controls.pitchDown || false,
        yawLeft: controls.yawLeft || false,
        yawRight: controls.yawRight || false,
        rollLeft: controls.rollLeft || false,
        rollRight: controls.rollRight || false,
        moveUp: controls.moveUp || false,
        moveDown: controls.moveDown || false,
        brake: controls.brake || false,
        shoot: controls.shoot || false
      };
      const newState = applyFlightPhysics(playerState, flightControls, delta);
      updatePlayerState(newState);

      // Update mesh position and rotation
      meshRef.current.position.copy(newState.position);
      meshRef.current.rotation.set(newState.rotation.x, newState.rotation.y, newState.rotation.z);

      // Handle shooting - twice per second (0.5 second intervals)
      if (flightControls.shoot && state.clock.elapsedTime - lastShootTime.current > 0.5) {
        lastShootTime.current = state.clock.elapsedTime;
        const direction = new THREE.Vector3(0, 0, -1);
        direction.applyQuaternion(meshRef.current.quaternion);
        console.log(`🔫 Player shooting! Position: (${meshRef.current.position.x.toFixed(1)}, ${meshRef.current.position.y.toFixed(1)}, ${meshRef.current.position.z.toFixed(1)})`);
        onShoot?.(meshRef.current.position.clone(), direction);
      }

      // Update camera to follow player
      const idealCameraPosition = new THREE.Vector3()
        .copy(meshRef.current.position)
        .add(new THREE.Vector3(0, 5, 15).applyQuaternion(meshRef.current.quaternion));
      
      state.camera.position.lerp(idealCameraPosition, delta * 2);
      state.camera.lookAt(meshRef.current.position);

    } else {
      // Enemy aircraft - only use provided position (synchronized with collision detection)
      // Position is controlled by GameScene to ensure collision detection works properly
      
      // Update mesh to look at center for realistic flight
      meshRef.current.lookAt(0, 0, 0);

      // Enemy shooting - more aggressive
      if (Math.random() < 0.02) { // 2% chance per frame to shoot
        const direction = new THREE.Vector3(0, 0, -1);
        direction.applyQuaternion(meshRef.current.quaternion);
        onShoot?.(meshRef.current.position.clone(), direction);
      }
    }
  });

  const primaryColor = team?.primaryColor || '#FF0000';
  const secondaryColor = team?.secondaryColor || '#FFFFFF';

  return (
    <group ref={meshRef}>
      {/* Football Helmet Main Body */}
      <mesh>
        <sphereGeometry args={[2, 16, 12, 0, Math.PI * 2, 0, Math.PI * 0.6]} />
        <meshLambertMaterial color={primaryColor} />
      </mesh>

      {/* Face mask - front grille */}
      <mesh position={[0, -0.3, -1.8]}>
        <boxGeometry args={[1.8, 0.1, 0.1]} />
        <meshLambertMaterial color="#CCCCCC" />
      </mesh>
      <mesh position={[0, -0.8, -1.6]}>
        <boxGeometry args={[1.8, 0.1, 0.1]} />
        <meshLambertMaterial color="#CCCCCC" />
      </mesh>
      <mesh position={[0, -1.3, -1.4]}>
        <boxGeometry args={[1.8, 0.1, 0.1]} />
        <meshLambertMaterial color="#CCCCCC" />
      </mesh>

      {/* Vertical face mask bars */}
      <mesh position={[-0.6, -0.8, -1.7]}>
        <boxGeometry args={[0.1, 1.2, 0.1]} />
        <meshLambertMaterial color="#CCCCCC" />
      </mesh>
      <mesh position={[0.6, -0.8, -1.7]}>
        <boxGeometry args={[0.1, 1.2, 0.1]} />
        <meshLambertMaterial color="#CCCCCC" />
      </mesh>

      {/* Team logo on left side */}
      <mesh position={[-2.1, 0, 0]} rotation={[0, Math.PI / 2, 0]}>
        <circleGeometry args={[0.8, 16]} />
        <meshLambertMaterial color={secondaryColor} />
      </mesh>
      <mesh position={[-2.05, 0, 0]} rotation={[0, Math.PI / 2, 0]}>
        <planeGeometry args={[1.2, 0.6]} />
        <meshLambertMaterial color={primaryColor} />
      </mesh>
      {/* Team abbreviation on left */}
      <mesh position={[-2.0, 0, 0]} rotation={[0, Math.PI / 2, 0]}>
        <planeGeometry args={[0.8, 0.3]} />
        <meshLambertMaterial color={secondaryColor} />
      </mesh>

      {/* Team logo on right side */}
      <mesh position={[2.1, 0, 0]} rotation={[0, -Math.PI / 2, 0]}>
        <circleGeometry args={[0.8, 16]} />
        <meshLambertMaterial color={secondaryColor} />
      </mesh>
      <mesh position={[2.05, 0, 0]} rotation={[0, -Math.PI / 2, 0]}>
        <planeGeometry args={[1.2, 0.6]} />
        <meshLambertMaterial color={primaryColor} />
      </mesh>
      {/* Team abbreviation on right */}
      <mesh position={[2.0, 0, 0]} rotation={[0, -Math.PI / 2, 0]}>
        <planeGeometry args={[0.8, 0.3]} />
        <meshLambertMaterial color={secondaryColor} />
      </mesh>

      {/* Team logo on back */}
      <mesh position={[0, 0, 2.1]} rotation={[0, Math.PI, 0]}>
        <circleGeometry args={[0.8, 16]} />
        <meshLambertMaterial color={secondaryColor} />
      </mesh>
      <mesh position={[0, 0, 2.05]} rotation={[0, Math.PI, 0]}>
        <planeGeometry args={[1.2, 0.6]} />
        <meshLambertMaterial color={primaryColor} />
      </mesh>
      {/* Team initials text on back */}
      <Text
        position={[0, 0, 1.95]}
        rotation={[0, Math.PI, 0]}
        fontSize={0.4}
        color={secondaryColor}
        anchorX="center"
        anchorY="middle"
        font="/fonts/inter.json"
      >
        {team?.abbreviation || "NFL"}
      </Text>
    </group>
  );
}
