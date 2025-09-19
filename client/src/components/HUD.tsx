import { useFlightGame } from "@/lib/stores/useFlightGame";
import { useAudio } from "@/lib/stores/useAudio";
import { nflTeams } from "@/lib/nflTeams";

export default function HUD() {
  const { playerState, selectedTeam, enemyAircraft } = useFlightGame();
  const { isMuted, toggleMute } = useAudio();
  
  const team = nflTeams.find(t => t.id === selectedTeam);
  const speed = Math.sqrt(
    playerState.velocity.x ** 2 + 
    playerState.velocity.y ** 2 + 
    playerState.velocity.z ** 2
  ) * 10; // Scale for display

  const throttlePercentage = Math.max(0, Math.min(100, playerState.throttle * 100));
  const altitude = Math.max(0, playerState.position.y);

  return (
    <div className="absolute inset-0 pointer-events-none">
      {/* Top HUD */}
      <div className="absolute top-4 left-4 right-4 flex justify-between items-start">
        {/* Team Info */}
        <div className="bg-black bg-opacity-70 p-4 rounded-lg text-white">
          <div className="flex items-center gap-3">
            <div 
              className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold"
              style={{ backgroundColor: team?.primaryColor || '#FF0000' }}
            >
              {team?.abbreviation || 'NFL'}
            </div>
            <div>
              <div className="font-bold">{team?.city} {team?.name}</div>
              <div className="text-sm text-gray-300">Fighter Squadron</div>
            </div>
          </div>
        </div>

        {/* Health Bar */}
        <div className="bg-black bg-opacity-70 p-4 rounded-lg text-white min-w-48">
          <div className="text-sm mb-2">Aircraft Integrity</div>
          <div className="w-full bg-gray-600 rounded-full h-3">
            <div 
              className={`h-3 rounded-full transition-all ${
                playerState.health > 50 ? 'bg-green-500' : 
                playerState.health > 25 ? 'bg-yellow-500' : 'bg-red-500'
              }`}
              style={{ width: `${playerState.health}%` }}
            />
          </div>
          <div className="text-xs mt-1 text-right">{Math.round(playerState.health)}%</div>
        </div>

        {/* Enemy Count */}
        <div className="bg-black bg-opacity-70 p-4 rounded-lg text-white">
          <div className="text-sm text-gray-300">Enemies</div>
          <div className="text-2xl font-bold">{enemyAircraft.length}</div>
        </div>
      </div>

      {/* Flight Instruments - Bottom Left */}
      <div className="absolute bottom-4 left-4 bg-black bg-opacity-70 p-4 rounded-lg text-white">
        <div className="grid grid-cols-2 gap-6">
          {/* Speed */}
          <div className="text-center">
            <div className="text-xs text-gray-300 mb-1">SPEED</div>
            <div className="text-2xl font-mono">{Math.round(speed)}</div>
            <div className="text-xs text-gray-300">KTS</div>
          </div>

          {/* Altitude */}
          <div className="text-center">
            <div className="text-xs text-gray-300 mb-1">ALT</div>
            <div className="text-2xl font-mono">{Math.round(altitude)}</div>
            <div className="text-xs text-gray-300">FT</div>
          </div>

          {/* Throttle */}
          <div className="text-center">
            <div className="text-xs text-gray-300 mb-1">THROTTLE</div>
            <div className="text-2xl font-mono">{Math.round(throttlePercentage)}</div>
            <div className="text-xs text-gray-300">%</div>
          </div>

          {/* Ammo */}
          <div className="text-center">
            <div className="text-xs text-gray-300 mb-1">AMMO</div>
            <div className="text-2xl font-mono">∞</div>
            <div className="text-xs text-gray-300">RDS</div>
          </div>
        </div>
      </div>

      {/* Controls Help - Bottom Right */}
      <div className="absolute bottom-4 right-4 bg-black bg-opacity-70 p-4 rounded-lg text-white text-xs">
        <div className="mb-2 font-bold">FLIGHT CONTROLS</div>
        <div>W/S: Throttle</div>
        <div>A/D: Yaw</div>
        <div>Q/E: Roll</div>
        <div>Z/X: Pitch</div>
        <div>R/F: Up/Down</div>
        <div>SPACE: Fire</div>
        <div className="mt-2">
          <button 
            className="pointer-events-auto hover:text-yellow-400 transition-colors"
            onClick={toggleMute}
          >
            M: Sound {isMuted ? 'OFF' : 'ON'}
          </button>
        </div>
      </div>

      {/* Crosshair */}
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
        <div className="w-8 h-8 relative">
          <div className="absolute top-1/2 left-0 w-3 h-0.5 bg-white"></div>
          <div className="absolute top-1/2 right-0 w-3 h-0.5 bg-white"></div>
          <div className="absolute left-1/2 top-0 w-0.5 h-3 bg-white"></div>
          <div className="absolute left-1/2 bottom-0 w-0.5 h-3 bg-white"></div>
          <div className="absolute top-1/2 left-1/2 w-1 h-1 bg-white rounded-full transform -translate-x-1/2 -translate-y-1/2"></div>
        </div>
      </div>
    </div>
  );
}
