import axios from 'axios';
import { useRouter } from 'next/router';
import CreateNewGameForm from '@/components/GameCodeForm/CreateNewGameForm';
import JoinGameForm from '@/components/GameCodeForm/JoinGameForm';

export default function GameCodeForm() {
  const router = useRouter();

  const handleCreateNewGame = async (playerName: string) => {
    const { data: player } = await axios.post('/api/player', {
      name: playerName,
    });
    localStorage.setItem('playerId', player.id);
    const { data: game } = await axios.post('/api/game', player);

    router.push(`/${game.id}`);
  };

  const handleJoinGame = async (gameCode: string, playerName: string) => {
    const { data: player } = await axios.post('/api/player', {
      name: playerName,
    });
    localStorage.setItem('playerId', player.id);
    await axios.put('/api/game', { player, gameId: gameCode });

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
