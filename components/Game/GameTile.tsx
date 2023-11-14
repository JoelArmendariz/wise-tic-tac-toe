import { twMerge } from "tailwind-merge";

interface GameTileProps {
  value: string;
  x: number;
  y: number;
}

const getCornerTileRadiusClasses = (x: number, y: number) => {
  if (x === 0 && y === 0) {
    return "rounded-tl-lg";
  }
  if (x === 2 && y === 0) {
    return "rounded-bl-lg";
  }
  if (x === 0 && y === 2) {
    return "rounded-tr-lg";
  }
  if (x === 2 && y === 2) {
    return "rounded-br-lg";
  }
};

export default function GameTile({ value, x, y }: GameTileProps) {
  return (
    <div
      className={twMerge(
        "relative flex h-full w-full justify-center items-center cursor-pointer hover:bg-primary-hover",
        "transition-all hover:scale-[105%] hover:z-10 duration-100 hover:rounded-lg border-primary-border border",
        getCornerTileRadiusClasses(x, y)
      )}
    >
      <span className="absolute text-2xl">{value}</span>
    </div>
  );
}
