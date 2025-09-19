import { Canvas } from "@react-three/fiber";
import { Suspense, useEffect, useState } from "react";
import { KeyboardControls } from "@react-three/drei";
import { useAudio } from "./lib/stores/useAudio";
import { useFlightGame } from "./lib/stores/useFlightGame";
import TeamSelection from "./components/TeamSelection";
import GameScene from "./components/GameScene";
import HUD from "./components/HUD";
import "@fontsource/inter";

// Define control keys for the flight game
enum Controls {
  throttleUp = 'throttleUp',
  throttleDown = 'throttleDown',
  pitchUp = 'pitchUp',
  pitchDown = 'pitchDown',
  yawLeft = 'yawLeft',
  yawRight = 'yawRight',
  rollLeft = 'rollLeft',
  rollRight = 'rollRight',
  moveUp = 'moveUp',
  moveDown = 'moveDown',
  shoot = 'shoot',
  brake = 'brake'
}

const controls = [
  { name: Controls.throttleUp, keys: ["KeyW", "ArrowUp"] },
  { name: Controls.throttleDown, keys: ["KeyS", "ArrowDown"] },
  { name: Controls.pitchUp, keys: ["KeyX"] },
  { name: Controls.pitchDown, keys: ["KeyZ"] },
  { name: Controls.yawLeft, keys: ["KeyA", "ArrowLeft"] },
  { name: Controls.yawRight, keys: ["KeyD", "ArrowRight"] },
  { name: Controls.rollLeft, keys: ["KeyQ"] },
  { name: Controls.rollRight, keys: ["KeyE"] },
  { name: Controls.moveUp, keys: ["KeyR"] },
  { name: Controls.moveDown, keys: ["KeyF"] },
  { name: Controls.shoot, keys: ["Space"] },
  { name: Controls.brake, keys: ["ShiftLeft", "ShiftRight"] },
];

function App() {
  const { gamePhase } = useFlightGame();
  const { toggleMute, setHitSound, setSuccessSound, setShootSound } = useAudio();
  const [showCanvas, setShowCanvas] = useState(false);

  // Initialize audio files
  useEffect(() => {
    const initializeAudio = () => {
      // Create and set hit sound
      const hitAudio = new Audio('/sounds/hit.mp3');
      hitAudio.preload = 'auto';
      setHitSound(hitAudio);
      
      // Create and set success sound
      const successAudio = new Audio('/sounds/success.mp3');
      successAudio.preload = 'auto';
      setSuccessSound(successAudio);
      
      // Create and set shoot sound (use hit sound as base)
      const shootAudio = new Audio('/sounds/hit.mp3');
      shootAudio.preload = 'auto';
      setShootSound(shootAudio);
    };
    
    initializeAudio();
  }, [setHitSound, setSuccessSound, setShootSound]);

  // Show the canvas once everything is loaded
  useEffect(() => {
    setShowCanvas(true);
  }, []);

  // Handle keyboard shortcuts
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.key === 'm' || e.key === 'M') {
        toggleMute();
      }
    };

    window.addEventListener('keypress', handleKeyPress);
    return () => window.removeEventListener('keypress', handleKeyPress);
  }, [toggleMute]);

  return (
    <div style={{ width: '100vw', height: '100vh', position: 'relative', overflow: 'hidden' }}>
      {showCanvas && (
        <KeyboardControls map={controls}>
          {gamePhase === 'team_selection' && <TeamSelection />}

          {gamePhase === 'playing' && (
            <>
              <Canvas
                shadows
                camera={{
                  position: [0, 5, 10],
                  fov: 75,
                  near: 0.1,
                  far: 2000
                }}
                gl={{
                  antialias: true,
                  powerPreference: "high-performance"
                }}
              >
                <color attach="background" args={["#87CEEB"]} />
                
                <Suspense fallback={null}>
                  <GameScene />
                </Suspense>
              </Canvas>
              <HUD />
            </>
          )}

          {gamePhase === 'game_over' && (
            <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-75">
              <div className="bg-white p-8 rounded-lg text-center">
                <h1 className="text-3xl font-bold mb-4 text-black">Game Over</h1>
                <button 
                  onClick={() => useFlightGame.getState().restartGame()}
                  className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  Play Again
                </button>
              </div>
            </div>
          )}
        </KeyboardControls>
      )}
    </div>
  );
}

export default App;
