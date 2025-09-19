import { create } from "zustand";
import { subscribeWithSelector } from "zustand/middleware";
import * as THREE from "three";
import { nflTeams } from "@/lib/nflTeams";

export type FlightGamePhase = "team_selection" | "playing" | "game_over";

export interface AircraftState {
  position: THREE.Vector3;
  rotation: THREE.Vector3;
  velocity: THREE.Vector3;
  health: number;
  throttle: number;
}

export interface EnemyAircraft {
  id: string;
  teamId: string;
  health: number;
}

interface FlightGameState {
  gamePhase: FlightGamePhase;
  selectedTeam: string | null;
  playerState: AircraftState;
  enemyAircraft: EnemyAircraft[];
  score: number;

  // Actions
  selectTeam: (teamId: string) => void;
  updatePlayerState: (state: AircraftState) => void;
  damageAircraft: (target: 'player' | 'enemy', damage: number, enemyId?: string) => void;
  restartGame: () => void;
}

const createInitialPlayerState = (): AircraftState => ({
  position: new THREE.Vector3(0, 10, 0),
  rotation: new THREE.Vector3(0, 0, 0),
  velocity: new THREE.Vector3(0, 0, 0),
  health: 100,
  throttle: 0.5
});

const createEnemyAircraft = (): EnemyAircraft[] => {
  // Create 3 random enemy aircraft
  const availableTeams = nflTeams.filter(team => team.id !== 'selectedTeam');
  const enemies: EnemyAircraft[] = [];
  
  for (let i = 0; i < 3; i++) {
    const randomTeam = availableTeams[Math.floor(Math.random() * availableTeams.length)];
    enemies.push({
      id: `enemy_${i}`,
      teamId: randomTeam.id,
      health: 100
    });
  }
  
  return enemies;
};

export const useFlightGame = create<FlightGameState>()(
  subscribeWithSelector((set, get) => ({
    gamePhase: "team_selection",
    selectedTeam: null,
    playerState: createInitialPlayerState(),
    enemyAircraft: [],
    score: 0,

    selectTeam: (teamId: string) => {
      console.log(`Team selected: ${teamId}`);
      set({
        selectedTeam: teamId,
        gamePhase: "playing",
        playerState: createInitialPlayerState(),
        enemyAircraft: createEnemyAircraft(),
        score: 0
      });
    },

    updatePlayerState: (newState: AircraftState) => {
      set({ playerState: newState });
    },

    damageAircraft: (target: 'player' | 'enemy', damage: number, enemyId?: string) => {
      const state = get();
      
      if (target === 'player') {
        const newHealth = Math.max(0, state.playerState.health - damage);
        set({
          playerState: {
            ...state.playerState,
            health: newHealth
          }
        });
        
        if (newHealth <= 0) {
          set({ gamePhase: "game_over" });
        }
      } else if (target === 'enemy') {
        const updatedEnemies = state.enemyAircraft.map(enemy => {
          if (!enemyId || enemy.id === enemyId) {
            const newHealth = Math.max(0, enemy.health - damage);
            return { ...enemy, health: newHealth };
          }
          return enemy;
        }).filter(enemy => enemy.health > 0);

        set({
          enemyAircraft: updatedEnemies,
          score: state.score + (updatedEnemies.length < state.enemyAircraft.length ? 100 : 0)
        });

        // Check if all enemies are defeated
        if (updatedEnemies.length === 0) {
          // Spawn new wave of enemies
          set({
            enemyAircraft: createEnemyAircraft(),
            score: state.score + 500 // Bonus for clearing wave
          });
        }
      }
    },

    restartGame: () => {
      set({
        gamePhase: "team_selection",
        selectedTeam: null,
        playerState: createInitialPlayerState(),
        enemyAircraft: [],
        score: 0
      });
    }
  }))
);
