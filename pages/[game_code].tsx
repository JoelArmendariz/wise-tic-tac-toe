import GameBoard from '@/components/Game/GameBoard';
import Button from '@/components/common/Button';
import useGame from '@/hooks/useGame';
import useSocket from '@/hooks/useSocket';
import { checkForWinner } from '@/utils/gameUtils';
import { ClipboardIcon } from '@heroicons/react/24/outline';
import { Player } from '@prisma/client';
import axios from 'axios';
import { useRouter } from 'next/router';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { twMerge } from 'tailwind-merge';

export default function GameSession() {
  const router = useRouter();
  const { game_code: gameId } = router.query as { game_code: string };
  const [codeCopied, setCodeCopied] = useState(false);
  const [isCurrentPlayer, setIsCurrentPlayer] = useState<boolean>();
  const [isOwner, setIsOwner] = useState<boolean>();
  const [winner, setWinner] = useState('');

  const { data: game, mutate } = useGame(gameId);
  const socket = useSocket();

  const updateCurrentPlayer = useCallback(() => {
    const playerId = localStorage.getItem('playerId');
    setIsCurrentPlayer(game?.currentPlayerID === playerId);
  }, [game?.currentPlayerID]);

  useEffect(() => {
    if (!socket) return;

    socket.emit('player-enter', localStorage.getItem('playerId'));
  }, [socket]);

  useEffect(() => {
    if (!socket || !game) return;

    socket.on('update-players', newPlayerId => {
      mutate({
        ...game,
        playerIDs: [...game.playerIDs, newPlayerId],
      });
    });
    socket.on('update-winner', (winner: Player) => {
      axios.post('/api/gameover', { winnerID: winner.id, gameId });
      setWinner(winner.name);
    });
  }, [socket, mutate, game, gameId]);

  useEffect(() => {
    const playerId = localStorage.getItem('playerId');
    setIsCurrentPlayer(game?.currentPlayerID === playerId);
    setIsOwner(game?.ownerID === playerId);
    if (game?.winnerID) {
      axios.get(`/api/player/?id=${game?.winnerID}`).then(data => {
        setWinner(data?.data?.name || '');
      });
    }
  }, [game?.currentPlayerID, game?.ownerID, game?.winnerID]);

  // Listen for the opponent to make a move
  useEffect(() => {
    if (!socket || !game) return;

    socket.on('update-board', (boardString: string) => {
      if (!boardString) return;
      setIsCurrentPlayer(true);
      mutate(
        {
          ...game,
          board: boardString,
        },
        { revalidate: false }
      );
    });
  }, [game, mutate, socket, updateCurrentPlayer]);

  const getWinner = async (board: string[][]) => {
    const hasWinner = checkForWinner(board);

    if (hasWinner) {
      const playerId = localStorage.getItem('playerId');
      const { data: winner }: { data: Player } = await axios.get(`/api/player/?id=${playerId}`);
      return winner;
    }
  };

  const handleMove = async (x: number, y: number) => {
    if (!game) return;

    const { board: boardString, ownerID, currentPlayerID } = game;
    const board = JSON.parse(boardString);
    const playerPiece = ownerID !== currentPlayerID ? 'O' : 'X';
    board[x][y] = playerPiece;
    const updatedBoardString = JSON.stringify(board);
    // Optimistically update the UI before the move gets posted to the DB
    mutate(
      {
        ...game,
        board: updatedBoardString,
      },
      { revalidate: false }
    );
    socket?.emit('player-move', updatedBoardString);
    const newWinner = await getWinner(board);
    if (newWinner) {
      socket?.emit('player-wins', newWinner);
    }
    setIsCurrentPlayer(false);
    await axios.post('/api/move/', { gameId, board: updatedBoardString });
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

  return game ? (
    <>
      <div className="flex justify-center mt-48 w-full h-full">
        <div className="flex flex-col">
          <span>{getGameStatus()}</span>
          <GameBoard board={JSON.parse(game.board)} onMove={handleMove} disabled={gameDisabled} />
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
  ) : null;
}
