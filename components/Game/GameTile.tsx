import { twMerge } from 'tailwind-merge';

interface GameTileProps {
  value: string;
  onMove: (x: number, y: number) => void;
  x: number;
  y: number;
  disabled?: boolean;
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

export default function GameTile({ value, x, y, onMove, disabled }: GameTileProps) {
  return (
    <div
      onClick={() => !disabled && onMove(x, y)}
      className={twMerge(
        'relative flex h-full w-full justify-center items-center',
        'transition-all duration-100 border-primary-border border',
        getCornerTileRadiusClasses(x, y),
        disabled
          ? 'cursor-not-allowed'
          : 'hover:scale-[105%] hover:z-10 hover:bg-primary-hover cursor-pointer hover:rounded-lg'
      )}
    >
      <span className="absolute text-2xl">{value}</span>
    </div>
  );
}
