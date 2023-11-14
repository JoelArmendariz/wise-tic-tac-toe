import GameBoard from "@/components/Game/GameBoard";
import Button from "@/components/common/Button";
import useGame from "@/hooks/useGame";
import { ClipboardIcon } from "@heroicons/react/24/outline";
import axios from "axios";
import { useRouter } from "next/router";
import { useState } from "react";
import { twMerge } from "tailwind-merge";

export default function GameSession() {
  const router = useRouter();
  const [codeCopied, setCodeCopied] = useState(false);
  const { game_code: gameId } = router.query as { game_code: string };

  const { data, mutate } = useGame(gameId);

  const handleMove = async (x: number, y: number) => {
    if (!data) return;
    const board = JSON.parse(data.board);
    const playerPiece = data.ownerID !== data.currentPlayerID ? "O" : "X";
    board[x][y] = playerPiece;
    const boardString = JSON.stringify(board);
    // Optimistically update the UI before the move gets posted to the DB
    mutate(
      {
        ...data,
        board: boardString,
      },
      { revalidate: false }
    );
    await axios.post(`/api/move/?gameId=${gameId}&board=${boardString}`);
  };

  const handleCopyGameCode = () => {
    navigator.clipboard.writeText(gameId);
    setCodeCopied(true);
  };

  return data ? (
    <>
      <div className="flex justify-center mt-48 w-full h-full">
        <GameBoard board={JSON.parse(data.board)} onMove={handleMove} />
      </div>
      <Button
        onClick={handleCopyGameCode}
        className={twMerge(
          "fixed right-6 bottom-6 flex flex-row items-center",
          !codeCopied && "animate-bounce"
        )}
      >
        Copy game code
        <ClipboardIcon className="h-4 w-4 ml-2" />
      </Button>
    </>
  ) : null;
}
