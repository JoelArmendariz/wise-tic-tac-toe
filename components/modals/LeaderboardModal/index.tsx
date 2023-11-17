import { CommonModalProps } from '@/constants/modals';
import usePlayers from '@/hooks/usePlayers';
import XMarkIcon from '@heroicons/react/24/solid/XMarkIcon';
import LeaderboardEntry from '@/components/modals/LeaderboardModal/LeaderboardEntry';
import LoadingSpinner from '@/components/common/LoadingSpinner';

export default function LeaderboardModal({ handleClose }: CommonModalProps) {
  const { data: players } = usePlayers();

  // Sort players by win count high to low
  const getSortedPlayersByWinCount = () =>
    players ? [...players].sort((playerA, playerB) => playerB.winCount - playerA.winCount) : [];

  return (
    <div className="relative text-black h-1/2 min-h-[35rem] w-5/6 rounded-lg bg-white p-4 shadow-lg sm:h-1/2 sm:w-2/3 md:h-1/2 md:w-2/3 lg:h-1/2 lg:w-2/3 xl:h-1/2 xl:w-1/2 2xl:h-1/2 2xl:w-1/3">
      <XMarkIcon className="absolute top-4 right-4 w-6 h-6 cursor-pointer" onClick={handleClose} />
      <div className="flex flex-col items-center justify-center w-full">
        <h1 className="text-4xl">Leaderboard</h1>
        <h2 className="text-xl">Top 5</h2>
      </div>
      <div className="flex flex-col w-full justify-center items-center space-y-4 mt-8">
        {players ? (
          <>
            <div className="flex flex-row w-1/2 justify-between text-sm">
              <span>Rank</span>
              <span>Name</span>
              <span>Wins</span>
            </div>
            {getSortedPlayersByWinCount()
              .slice(0, 5)
              .map((player, i) => (
                <LeaderboardEntry
                  key={`leaderboard-entry--${player.name}`}
                  player={player}
                  position={i + 1}
                />
              ))}
          </>
        ) : (
          <LoadingSpinner />
        )}
      </div>
    </div>
  );
}
