import GameBoard from '@/components/Game/GameBoard';
import Button from '@/components/common/Button';
import Header from '@/components/common/Header';
import LoadingSpinner from '@/components/common/LoadingSpinner';
import useGame from '@/hooks/useGame';
import useSocketEvents from '@/hooks/useSocketEvents';
import { createGameByPlayer, setGameOver, updateGameBoard } from '@/services/game';
import { getWinningOrTieRows } from '@/utils/gameUtils';
import { ClipboardIcon } from '@heroicons/react/24/outline';
import { GameStatus, Player } from '@prisma/client';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { twMerge } from 'tailwind-merge';

export default function GameSession() {
  const router = useRouter();
  const { game_code: gameId } = router.query as { game_code: string };
  const [codeCopied, setCodeCopied] = useState(false);
  const [isCurrentPlayer, setIsCurrentPlayer] = useState<boolean>();
  const [isOwner, setIsOwner] = useState<boolean>();
  const [winner, setWinner] = useState('');
  const [isTie, setIsTie] = useState(false);

  const { data: game, isLoading: isGameLoading, mutate } = useGame(gameId);

  const socket = useSocketEvents({
    'new-player': ({ gameId: newGameId, playerId }) => {
      if (!game || newGameId !== gameId) return;
      mutate({
        ...game,
        playerIDs: [...game.playerIDs, playerId],
      });
    },
    'update-winner': (winner: Player) => {
      setWinner(winner.name);
    },
    'update-tie': () => {
      setIsTie(true);
    },
    'update-board': (updatedBoardString: string) => {
      if (!updatedBoardString || !game) return;
      setIsCurrentPlayer(true);
      mutate(
        {
          ...game,
          board: updatedBoardString,
        },
        { revalidate: false }
      );
    },
  });

  // Setup the game values
  useEffect(() => {
    const playerId = localStorage.getItem('playerId');
    setIsCurrentPlayer(game?.currentPlayerID === playerId);
    setIsOwner(game?.ownerID === playerId);
    if (game?.winner) {
      setWinner(game.winner.name);
    } else if (game?.status === GameStatus.INDETERMINATE) {
      setIsTie(true);
    }
  }, [game?.currentPlayerID, game?.ownerID, game?.status, game?.winner]);

  // Send player-enter event when user mounts the game
  useEffect(() => {
    if (!socket) return;
    socket.emit('player-enter', { gameId, playerId: localStorage.getItem('playerId') });
  }, [socket, gameId]);

  const checkGameResult = (board: string[][]) => {
    const resultRows = getWinningOrTieRows(board);
    // Game is not over
    if (!resultRows) return;

    // There is a winner
    if (resultRows.length === 3) {
      const playerId = localStorage.getItem('playerId');
      const newWinner = game?.players.find(({ id }) => id === playerId);
      if (newWinner) {
        socket?.emit('player-wins', newWinner);
        setWinner(newWinner.name);
        setGameOver(gameId, newWinner.id);
      }
    }
    // There is a tie
    if (resultRows.length > 3) {
      socket?.emit('tie-game');
      setIsTie(true);
      setGameOver(gameId);
    }
  };

  const handleMove = (x: number, y: number) => {
    if (!game) return;

    const { board: boardString, ownerID, currentPlayerID } = game;
    const board = JSON.parse(boardString);
    const playerPiece = ownerID !== currentPlayerID ? 'O' : 'X';
    board[x][y] = playerPiece;
    const updatedBoardString = JSON.stringify(board);
    // Update our opponent with the new board
    socket?.emit('player-move', updatedBoardString);
    // Update our own UI with the new board
    mutate(
      {
        ...game,
        board: updatedBoardString,
      },
      { revalidate: false }
    );
    checkGameResult(board);
    setIsCurrentPlayer(false);
    // Finally persist the board change to the DB
    updateGameBoard(gameId, updatedBoardString);
  };

  const handleLeaveGame = () => {
    router.push('/');
  };

  const handleCopyGameCode = () => {
    navigator.clipboard.writeText(gameId);
    setCodeCopied(true);
  };

  const handlePlayAgain = async () => {
    // Create new game and route to it
    const playerId = localStorage.getItem('playerId');
    const player = game?.players.find(player => player.id === playerId);
    if (player) {
      const newGame = await createGameByPlayer(player);
      setWinner('');
      setIsTie(false);
      setCodeCopied(false);
      mutate(newGame);
      router.push(`/${newGame.id}`);
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

  return !isGameLoading ? (
    <>
      <Header />
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
              <Button className="mt-2 w-full" onClick={handlePlayAgain}>
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
  ) : (
    <div className="flex justify-center mt-48 w-full h-full">
      <div className="flex flex-col">
        <LoadingSpinner />
      </div>
    </div>
  );
}
