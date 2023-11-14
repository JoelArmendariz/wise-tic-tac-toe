import GameRow from "./GameRow";

interface GameBoardProps {
  board: string[][];
  onMove: (x: number, y: number) => void;
}

export default function GameBoard({ board, onMove }: GameBoardProps) {
  return (
    <div className="grid w-96 h-96 rounded-lg shadow-lg bg-primary border border-primary-border">
      {board.map((row, i) => (
        <GameRow key={`game-row--${i}`} onMove={onMove} row={row} x={i} />
      ))}
    </div>
  );
}
