import { getWinningGameRow } from '@/utils/gameUtils';
import { twMerge } from 'tailwind-merge';

interface GameTileProps {
  value: string;
  onMove: (x: number, y: number) => void;
  x: number;
  y: number;
  disabled?: boolean;
  board: string[][];
}

const getCornerTileRadiusClasses = (x: number, y: number) => {
  if (x === 0 && y === 0) {
    return 'rounded-tl-lg';
  }
  if (x === 2 && y === 0) {
    return 'rounded-bl-lg';
  }
  if (x === 0 && y === 2) {
    return 'rounded-tr-lg';
  }
  if (x === 2 && y === 2) {
    return 'rounded-br-lg';
  }
};

export default function GameTile({
  value,
  x,
  y,
  onMove,
  disabled: disabledProp,
  board,
}: GameTileProps) {
  const disabled = disabledProp || value !== '-';
  const isWinningTile = getWinningGameRow(board)?.find(
    coordinates => coordinates[0] === x && coordinates[1] === y
  );
  return (
    <div
      onClick={() => !disabled && onMove(x, y)}
      className={twMerge(
        'relative flex h-full w-full justify-center items-center',
        'transition-all duration-100 border-primary-border border',
        getCornerTileRadiusClasses(x, y),
        isWinningTile ? 'bg-error' : '',
        disabled
          ? 'cursor-not-allowed'
          : 'hover:scale-[105%] hover:z-10 hover:bg-primary-hover cursor-pointer hover:rounded-lg'
      )}
    >
      <span className="absolute text-2xl">{value}</span>
    </div>
  );
}
