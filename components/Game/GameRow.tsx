import GameTile from "./GameTile";

interface GameRowProps {
  row: string[];
  x: number;
}

export default function GameRow({ row, x }: GameRowProps) {
  return (
    <div className="grid grid-cols-3">
      {row.map((tileValue, i) => (
        <GameTile key={`game-tile--${i}`} value={tileValue} x={x} y={i} />
      ))}
    </div>
  );
}
