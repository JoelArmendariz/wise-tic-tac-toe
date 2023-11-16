import GameBoard from '@/components/Game/GameBoard';
import Button from '@/components/common/Button';
import Header from '@/components/common/Header';
import LoadingSpinner from '@/components/common/LoadingSpinner';
import useGame from '@/hooks/useGame';
import useSocketEvents from '@/hooks/useSocketEvents';
import { checkForWinner } from '@/utils/gameUtils';
import { ClipboardIcon } from '@heroicons/react/24/outline';
import { Player } from '@prisma/client';
import axios from 'axios';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { twMerge } from 'tailwind-merge';

export default function GameSession() {
  const router = useRouter();
  const { game_code: gameId } = router.query as { game_code: string };
  const [codeCopied, setCodeCopied] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isCurrentPlayer, setIsCurrentPlayer] = useState<boolean>();
  const [isOwner, setIsOwner] = useState<boolean>();
  const [winner, setWinner] = useState('');

  const { data: game, isLoading: isGameLoading, mutate } = useGame(gameId);

  const socket = useSocketEvents({
    'new-player': (newPlayerId: string) => {
      if (!game) return;
      mutate({
        ...game,
        playerIDs: [...game.playerIDs, newPlayerId],
      });
    },
    'update-winner': (winner: Player) => {
      setWinner(winner.name);
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

  // Send player-enter event when user mounts the game
  useEffect(() => {
    if (!socket) return;
    socket.emit('player-enter', localStorage.getItem('playerId'));
  }, [socket]);

  useEffect(() => {
    const playerId = localStorage.getItem('playerId');
    setIsCurrentPlayer(game?.currentPlayerID === playerId);
    setIsOwner(game?.ownerID === playerId);
    if (game?.winnerID) {
      setIsLoading(true);
      axios.get(`/api/player/?id=${game.winnerID}`).then(winnerData => {
        setWinner(winnerData.data.name);
        setIsLoading(false);
      });
    } else {
      setIsLoading(false);
    }
  }, [game?.currentPlayerID, game?.ownerID, game?.winnerID]);

  const getWinner = (board: string[][]) => {
    const hasWinner = checkForWinner(board);

    if (hasWinner) {
      const playerId = localStorage.getItem('playerId');
      return game?.players.find(({ id }) => id === playerId);
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
    const newWinner = getWinner(board);
    if (newWinner) {
      socket?.emit('player-wins', newWinner);
      setWinner(newWinner.name);
      axios.post('/api/gameover', { gameId, winnerID: newWinner.id });
    }
    setIsCurrentPlayer(false);
    // Finally persist the board change to the DB
    axios.post('/api/move/', { gameId, board: updatedBoardString });
  };

  const handleLeaveGame = () => {
    router.push('/');
  };

  const handleCopyGameCode = () => {
    navigator.clipboard.writeText(gameId);
    setCodeCopied(true);
  };

  const getGameStatus = () => {
    if (winner) {
      return `${winner} wins!!`;
    }
    if (isCurrentPlayer && game?.playerIDs.length && game?.playerIDs.length > 1) {
      return "It's your turn";
    }
    // isCurrentPlayer is possibly undefined, so we should be explicit here
    if (isCurrentPlayer === false || game?.playerIDs.length === 1) {
      return 'Waiting for opponent';
    }
    return '';
  };

  const gameDisabled =
    !isCurrentPlayer || (game?.playerIDs && game?.playerIDs.length === 1) || !!winner;

  return !isGameLoading && !isLoading ? (
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
          <Button className="mt-2" variant="secondary" onClick={handleLeaveGame}>
            Exit game
          </Button>
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
