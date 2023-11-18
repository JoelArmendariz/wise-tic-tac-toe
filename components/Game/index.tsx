import { ClipboardIcon } from '@heroicons/react/24/outline';
import Button from '../common/Button';
import GameBoard from './GameBoard';
import { useRouter } from 'next/router';
import { GameWithPlayerObjects } from '@/types/gameTypes';
import { twMerge } from 'tailwind-merge';

interface GameProps {
  winner?: string;
  isTie?: boolean;
  isCurrentPlayer?: boolean;
  game?: GameWithPlayerObjects;
  isOwner?: boolean;
  handlePlayAgain: () => void;
  handleMove: (x: number, y: number) => void;
  codeCopied: boolean;
  setCodeCopied: (copied: boolean) => void;
  isCreatingNewGame?: boolean;
}

export default function Game({
  winner,
  isTie,
  isCurrentPlayer,
  game,
  isOwner,
  handlePlayAgain,
  handleMove,
  codeCopied,
  setCodeCopied,
  isCreatingNewGame,
}: GameProps) {
  const router = useRouter();

  const handleLeaveGame = () => {
    router.push('/');
  };

  const handleCopyGameCode = () => {
    if (game) {
      navigator.clipboard.writeText(game.id);
      setCodeCopied(true);
    }
  };

  const getGameStatus = () => {
    if (winner) {
      return `Game over - ${winner} wins!!`;
    }
    if (isTie) {
      return "Game over - It's a tie!";
    }
    if (isCurrentPlayer && game?.playerIDs.length && game?.playerIDs.length > 1) {
      return "It's your turn";
    }
    // isCurrentPlayer is possibly undefined, so we should be explicit here
    if (isCurrentPlayer === false || game?.playerIDs?.length === 1) {
      return `Waiting for opponent${
        game?.playerIDs?.length === 1 ? ' - share the game code!' : ''
      }`;
    }
    return '';
  };

  const gameDisabled =
    !isCurrentPlayer || (game?.playerIDs && game?.playerIDs.length === 1) || !!winner;

  return (
    <>
      <div className="flex justify-center mt-48 w-full h-full">
        <div className="flex flex-col">
          <span>{getGameStatus()}</span>
          <GameBoard
            board={game ? JSON.parse(game.board) : []}
            onMove={handleMove}
            disabled={gameDisabled}
          />
          <div className="flex flex-row space-x-2 w-full">
            <Button className="mt-2 w-full" variant="secondary" onClick={handleLeaveGame}>
              Exit game
            </Button>
            {(!!winner && isOwner) || (isTie && isOwner) ? (
              <Button
                isLoading={isCreatingNewGame}
                className="mt-2 w-full"
                onClick={handlePlayAgain}
              >
                Create another game
              </Button>
            ) : null}
          </div>
        </div>
      </div>
      <Button
        onClick={handleCopyGameCode}
        className={twMerge(
          'fixed right-6 bottom-6 flex flex-row items-center',
          !codeCopied && isOwner && 'animate-bounce'
        )}
      >
        Copy game code
        <ClipboardIcon className="h-4 w-4 ml-2" />
      </Button>
    </>
  );
}
