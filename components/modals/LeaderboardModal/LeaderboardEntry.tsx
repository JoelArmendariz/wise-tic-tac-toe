import { Player } from '@prisma/client';

interface LeaderboardEntryProps {
  position: number;
  player: Player;
}

export default function LeaderboardEntry({ player, position }: LeaderboardEntryProps) {
  return (
    <div className="flex flex-row w-1/2 justify-between py-2 px-4 bg-primary rounded-lg">
      <span>{position}</span>
      <span>{player.name}</span>
      <span>{player.winCount}</span>
    </div>
  );
}
