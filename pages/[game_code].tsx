import Game from '@/components/Game';
import Header from '@/components/common/Header';
import LoadingSpinner from '@/components/common/LoadingSpinner';
import { Modals } from '@/constants/modals';
import { useModalContext } from '@/context/Modal/ModalProvider';
import useGame from '@/hooks/useGame';
import useSocketEvents from '@/hooks/useSocketEvents';
import { createGameByPlayer, setGameOver, updateGameBoard } from '@/services/game';
import { getWinningOrTieRows } from '@/utils/gameUtils';
import { GameStatus } from '@prisma/client';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';

export default function GameSession() {
  const router = useRouter();
  const { game_code: gameId } = router.query as { game_code: string };
  const { showModal } = useModalContext();
  const [codeCopied, setCodeCopied] = useState(false);
  const [isCurrentPlayer, setIsCurrentPlayer] = useState<boolean>(false);
  const [isCreatingNewGame, setIsCreatingNewGame] = useState<boolean>(false);
  const [isOwner, setIsOwner] = useState<boolean>(false);
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
    'update-winner': ({ player: winner, gameId: eventGameId }) => {
      if (!game || eventGameId !== gameId) return;
      setWinner(winner.name);
    },
    'update-tie': (eventGameId: string) => {
      if (!game || eventGameId !== gameId) return;
      setIsTie(true);
    },
    'update-board': ({ boardString: updatedBoardString, gameId: eventGameId }) => {
      console.log('eventGameId: ', eventGameId);
      if (!updatedBoardString || !game || gameId !== eventGameId) return;
      const playerId = localStorage.getItem('playerId') || '';
      setIsCurrentPlayer(true);
      mutate(
        {
          ...game,
          currentPlayerID: playerId,
          board: updatedBoardString,
        },
        { revalidate: false }
      );
    },
    'prompt-restart': ({
      playerId: fromPlayerId,
      playerName: fromPlayerName,
      gameId: fromGameId,
      newGameId,
    }) => {
      if (!game || fromGameId !== gameId) return;
      const currentPlayerId = localStorage.getItem('playerId');
      if (fromPlayerId !== currentPlayerId && fromGameId === gameId) {
        showModal(Modals.RESTART_GAME_MODAL, {
          newGameId,
          fromPlayerName,
          onPlayAgain: () => {
            setWinner('');
            setIsTie(false);
            setCodeCopied(false);
          },
        });
      }
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
        socket?.emit('player-wins', { player: newWinner, gameId });
        setWinner(newWinner.name);
        setGameOver(gameId, newWinner.id);
      }
    }
    // There is a tie
    if (resultRows.length > 3) {
      socket?.emit('tie-game', gameId);
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
    socket?.emit('player-move', { boardString: updatedBoardString, gameId });
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

  const handlePlayAgain = async () => {
    // Create new game and route to it
    const playerId = localStorage.getItem('playerId');
    const player = game?.players.find(player => player.id === playerId);
    if (player) {
      setIsCreatingNewGame(true);
      const newGame = await createGameByPlayer(player);
      setWinner('');
      setIsTie(false);
      setCodeCopied(false);
      mutate(newGame);
      socket?.emit('restart-game', {
        playerId,
        playerName: player.name,
        gameId,
        newGameId: newGame.id,
      });
      router.push(`/${newGame.id}`);
      setIsCreatingNewGame(false);
    }
  };

  return !isGameLoading ? (
    <>
      <Header />
      <Game
        winner={winner}
        isTie={isTie}
        isCurrentPlayer={isCurrentPlayer}
        game={game}
        isOwner={isOwner}
        handlePlayAgain={handlePlayAgain}
        handleMove={handleMove}
        codeCopied={codeCopied}
        setCodeCopied={setCodeCopied}
        isCreatingNewGame={isCreatingNewGame}
      />
    </>
  ) : (
    <div className="flex justify-center mt-48 w-full h-full">
      <div className="flex flex-col">
        <LoadingSpinner />
      </div>
    </div>
  );
}
