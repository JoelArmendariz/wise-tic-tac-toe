import { useRouter } from 'next/router';
import CreateNewGameForm from '@/components/GameCodeForm/CreateNewGameForm';
import JoinGameForm from '@/components/GameCodeForm/JoinGameForm';
import { getOrCreatePlayerByName } from '@/services/player';
import { addPlayerToGame, createGameByPlayer } from '@/services/game';
import { useState } from 'react';

export default function GameCodeForm() {
  const router = useRouter();
  const [isCreatingGame, setIsCreatingGame] = useState(false);
  const [isJoiningGame, setIsJoiningGame] = useState(false);

  const handleCreateNewGame = async (playerName: string) => {
    setIsCreatingGame(true);
    const player = await getOrCreatePlayerByName(playerName);
    localStorage.setItem('playerId', player.id);
    const game = await createGameByPlayer(player);
    router.push(`/${game.id}`);
    setIsCreatingGame(false);
  };

  const handleJoinGame = async (gameCode: string, playerName: string) => {
    setIsJoiningGame(true);
    const player = await getOrCreatePlayerByName(playerName);
    localStorage.setItem('playerId', player.id);
    await addPlayerToGame(gameCode, player);
    router.push(`/${gameCode}`);
    setIsJoiningGame(false);
  };

  return (
    <div className="mt-72 px-4">
      <CreateNewGameForm isCreatingGame={isCreatingGame} onCreateNewGame={handleCreateNewGame} />
      <div className="flex justify-center items-center rounded-full border border-secondary w-8 h-8 p-5">
        or
      </div>
      <JoinGameForm
        setIsJoiningGame={setIsJoiningGame}
        isJoiningGame={isJoiningGame}
        onJoinGame={handleJoinGame}
      />
    </div>
  );
}
