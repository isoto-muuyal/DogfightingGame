import { useState, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import Aircraft from "./Aircraft";
import Bullet from "./Bullet";
import Environment from "./Environment";
import { useFlightGame } from "@/lib/stores/useFlightGame";
import { useAudio } from "@/lib/stores/useAudio";

interface EnemyData {
  id: string;
  teamId: string;
  position: THREE.Vector3;
}

interface BulletData {
  id: string;
  position: THREE.Vector3;
  direction: THREE.Vector3;
  isPlayerBullet: boolean;
  createdAt: number;
}

export default function GameScene() {
  const { selectedTeam, playerState, enemyAircraft, damageAircraft } = useFlightGame();
  const { playHit, playShoot } = useAudio();
  const [bullets, setBullets] = useState<BulletData[]>([]);
  const bulletIdCounter = useRef(0);
  const [enemyData, setEnemyData] = useState<EnemyData[]>([]);

  const handleShoot = (position: THREE.Vector3, direction: THREE.Vector3, isPlayer: boolean = true) => {
    const newBullet: BulletData = {
      id: `bullet_${bulletIdCounter.current++}`,
      position: position.clone(),
      direction: direction.clone().normalize(),
      isPlayerBullet: isPlayer,
      createdAt: Date.now()
    };
    
    setBullets(prev => [...prev, newBullet]);
    playShoot(); // Play shoot sound effect
    console.log(`Shot fired: ${isPlayer ? 'Player' : 'Enemy'} bullet created at`, position);
  };

  const handleBulletHit = (bulletId: string, hitPosition: THREE.Vector3) => {
    setBullets(prev => prev.filter(b => b.id !== bulletId));
    
    const bullet = bullets.find(b => b.id === bulletId);
    if (bullet?.isPlayerBullet) {
      // Player hit enemy
      damageAircraft('enemy', 25);
      playHit();
      console.log('🎯 PLAYER HIT ENEMY! Damage dealt: 25');
    } else {
      // Enemy hit player
      damageAircraft('player', 25);
      playHit();
      console.log('💥 ENEMY HIT PLAYER! Damage taken: 25');
    }
  };

  const handleBulletExpire = (bulletId: string) => {
    setBullets(prev => prev.filter(b => b.id !== bulletId));
  };

  // Clean up old bullets periodically and update enemy positions
  useFrame((state) => {
    setBullets(prev => prev.filter(bullet => {
      const age = Date.now() - bullet.createdAt;
      return age < 5000; // Remove bullets older than 5 seconds
    }));

    // Update enemy positions for collision detection - synchronized with actual positions
    const newEnemyData = enemyAircraft.map((enemy, index) => {
      const time = state.clock.elapsedTime;
      const radius = 60;
      const position = new THREE.Vector3(
        Math.cos(time * 0.5 + index * 2) * radius,
        25 + Math.sin(time * 0.3) * 10,
        Math.sin(time * 0.5 + index * 2) * radius
      );
      return {
        id: enemy.id,
        teamId: enemy.teamId,
        position
      };
    });
    setEnemyData(newEnemyData);
  });

  if (!selectedTeam) return null;

  return (
    <>
      {/* Lighting */}
      <ambientLight intensity={0.6} />
      <directionalLight
        position={[100, 100, 50]}
        intensity={1}
        castShadow
        shadow-mapSize-width={2048}
        shadow-mapSize-height={2048}
        shadow-camera-far={500}
        shadow-camera-left={-100}
        shadow-camera-right={100}
        shadow-camera-top={100}
        shadow-camera-bottom={-100}
      />

      {/* Environment */}
      <Environment />

      {/* Player Aircraft */}
      <Aircraft
        isPlayer={true}
        teamId={selectedTeam}
        onShoot={(pos, dir) => handleShoot(pos, dir, true)}
      />

      {/* Enemy Aircraft */}
      {enemyData.map((enemy, index) => (
        <Aircraft
          key={enemy.id}
          teamId={enemy.teamId}
          position={[enemy.position.x, enemy.position.y, enemy.position.z]}
          onShoot={(pos, dir) => handleShoot(pos, dir, false)}
        />
      ))}

      {/* Bullets */}
      {bullets.map(bullet => (
        <Bullet
          key={bullet.id}
          id={bullet.id}
          initialPosition={bullet.position}
          direction={bullet.direction}
          onHit={handleBulletHit}
          onExpire={handleBulletExpire}
          playerPosition={playerState.position}
          enemyPositions={enemyData.map(e => e.position)}
          isPlayerBullet={bullet.isPlayerBullet}
        />
      ))}
    </>
  );
}
