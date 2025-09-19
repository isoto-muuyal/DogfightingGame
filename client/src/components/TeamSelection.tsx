import { useState } from "react";
import { useFlightGame } from "@/lib/stores/useFlightGame";
import { nflTeams } from "@/lib/nflTeams";

export default function TeamSelection() {
  const { selectTeam } = useFlightGame();
  const [selectedTeam, setSelectedTeam] = useState<string | null>(null);

  const handleTeamSelect = (teamId: string) => {
    setSelectedTeam(teamId);
  };

  const handleStartGame = () => {
    if (selectedTeam) {
      selectTeam(selectedTeam);
    }
  };

  return (
    <div className="absolute inset-0 flex flex-col items-center justify-center bg-gradient-to-b from-blue-900 to-blue-600">
      <div className="bg-black bg-opacity-80 p-8 rounded-lg max-w-6xl w-full mx-4">
        <h1 className="text-4xl font-bold text-center mb-8 text-white">
          NFL Fighter Squadron
        </h1>
        <p className="text-center text-gray-300 mb-8">
          Select your team's fighter aircraft
        </p>

        <div className="grid grid-cols-4 md:grid-cols-8 gap-4 mb-8 max-h-96 overflow-y-auto">
          {nflTeams.map((team) => (
            <div
              key={team.id}
              onClick={() => handleTeamSelect(team.id)}
              className={`cursor-pointer p-4 rounded-lg border-2 transition-all ${
                selectedTeam === team.id
                  ? 'border-yellow-400 bg-yellow-400 bg-opacity-20'
                  : 'border-gray-600 hover:border-gray-400'
              }`}
              style={{ backgroundColor: selectedTeam === team.id ? `${team.primaryColor}40` : 'transparent' }}
            >
              <div 
                className="w-16 h-16 rounded-full mx-auto mb-2 flex items-center justify-center text-white font-bold text-xs"
                style={{ backgroundColor: team.primaryColor }}
              >
                {team.abbreviation}
              </div>
              <p className="text-center text-sm text-white font-medium">
                {team.city}
              </p>
              <p className="text-center text-xs text-gray-300">
                {team.name}
              </p>
            </div>
          ))}
        </div>

        {selectedTeam && (
          <div className="text-center">
            <div className="mb-4">
              <p className="text-white mb-2">
                Selected: <span className="font-bold">{nflTeams.find(t => t.id === selectedTeam)?.city} {nflTeams.find(t => t.id === selectedTeam)?.name}</span>
              </p>
            </div>
            <button
              onClick={handleStartGame}
              className="px-8 py-4 bg-green-600 text-white rounded-lg font-bold text-xl hover:bg-green-700 transition-colors"
            >
              Take Flight!
            </button>
          </div>
        )}

        <div className="mt-8 text-center text-gray-400 text-sm">
          <p>Controls: W/S - Throttle | A/D - Yaw | Q/E - Roll | Z/X - Pitch | R/F - Up/Down | Space - Shoot | M - Toggle Sound</p>
        </div>
      </div>
    </div>
  );
}
