import GameRow from "./GameRow";

const board = [
  ["", "", "O"],
  ["", "", "X"],
  ["", "", "X"],
];

export default function GameBoard() {
  return (
    <div className="grid w-96 h-96 rounded-lg shadow-lg bg-primary border border-primary-border">
      {board.map((row, i) => (
        <GameRow key={`game-row--${i}`} row={row} x={i} />
      ))}
    </div>
  );
}
