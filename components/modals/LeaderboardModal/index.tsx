import { CommonModalProps } from '@/constants/modals';
import usePlayers from '@/hooks/usePlayers';
import XMarkIcon from '@heroicons/react/24/solid/XMarkIcon';
import LeaderboardEntry from '@/components/modals/LeaderboardModal/LeaderboardEntry';

export default function LeaderboardModal({ handleClose }: CommonModalProps) {
  const { data: players } = usePlayers();

  const getSortedPlayersByWinCount = () =>
    players ? [...players].sort((playerA, playerB) => playerB.wins - playerA.wins) : [];

  return (
    <div className="flex w-full justify-center">
      <div className="relative text-black h-3/4 min-h-[50rem] w-5/6 rounded-lg border-0 bg-gray-200 p-4 shadow-lg sm:h-3/4 sm:w-5/6 md:h-3/4 md:w-5/6 lg:h-3/4 lg:w-5/6 xl:h-3/4 xl:w-5/6 2xl:h-3/4 2xl:w-2/3">
        <XMarkIcon
          className="absolute top-4 right-4 w-6 h-6 cursor-pointer"
          onClick={handleClose}
        />
        <div className="flex flex-col items-center justify-center w-full">
          <h1 className="text-4xl">Leaderboard</h1>
          <h2 className="text-xl">Top 10</h2>
        </div>
        <div className="flex flex-col w-full justify-center items-center space-y-4 mt-8">
          <div className="flex flex-row w-1/2 justify-between text-sm">
            <span>Rank</span>
            <span>Name</span>
            <span>Wins</span>
          </div>
          {getSortedPlayersByWinCount()
            .slice(0, 10)
            .map((player, i) => (
              <LeaderboardEntry
                key={`leaderboard-entry--${player.name}`}
                player={player}
                position={i + 1}
              />
            ))}
        </div>
      </div>
    </div>
  );
}
