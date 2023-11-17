import { useRouter } from 'next/router';
import CreateNewGameForm from '@/components/GameCodeForm/CreateNewGameForm';
import JoinGameForm from '@/components/GameCodeForm/JoinGameForm';
import { getOrCreatePlayerByName } from '@/services/player';
import { addPlayerToGame, createGameByPlayer } from '@/services/game';

export default function GameCodeForm() {
  const router = useRouter();

  const handleCreateNewGame = async (playerName: string) => {
    const player = await getOrCreatePlayerByName(playerName);
    localStorage.setItem('playerId', player.id);
    const game = await createGameByPlayer(player);
    router.push(`/${game.id}`);
  };

  const handleJoinGame = async (gameCode: string, playerName: string) => {
    const player = await getOrCreatePlayerByName(playerName);
    localStorage.setItem('playerId', player.id);
    await addPlayerToGame(gameCode, player);

    router.push(`/${gameCode}`);
  };

  return (
    <div className="mt-72 px-4">
      <CreateNewGameForm onCreateNewGame={handleCreateNewGame} />
      <div className="flex justify-center items-center rounded-full border border-secondary w-8 h-8 p-5">
        or
      </div>
      <JoinGameForm onJoinGame={handleJoinGame} />
    </div>
  );
}
