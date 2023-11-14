import GameTile from "./GameTile";

interface GameRowProps {
  row: string[];
  x: number;
  onMove: (x: number, y: number) => void;
}

export default function GameRow({ row, x, onMove }: GameRowProps) {
  return (
    <div className="grid grid-cols-3">
      {row.map((tileValue, i) => (
        <GameTile
          key={`game-tile--${i}`}
          onMove={onMove}
          value={tileValue}
          x={x}
          y={i}
        />
      ))}
    </div>
  );
}
