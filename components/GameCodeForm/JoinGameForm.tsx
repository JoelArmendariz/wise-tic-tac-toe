import Button from '@/components/common/Button';
import TextInput from '@/components/common/TextInput';
import axios from 'axios';
import { ChangeEvent, useState } from 'react';

interface JoinGameFormProps {
  onJoinGame: (gameCode: string, playerName: string) => void;
}

export default function JoinGameForm({ onJoinGame }: JoinGameFormProps) {
  const [formValues, setFormValues] = useState({
    gameCode: '',
    playerName: '',
  });
  const [errors, setErrors] = useState({
    gameCode: '',
    playerName: '',
  });

  const setError = (key: keyof typeof errors, error: string) =>
    setErrors(prevErrors => ({ ...prevErrors, [key]: error }));

  const setFormValue = (key: keyof typeof formValues, value: string) =>
    setFormValues(prevFormValues => ({ ...prevFormValues, [key]: value }));

  const validate = async () => {
    const { gameCode, playerName } = formValues;
    if (!gameCode || !playerName) {
      if (!gameCode) {
        setError('gameCode', 'Please enter a game code!');
      }
      if (!playerName) {
        setError('playerName', 'Please enter a player name!');
      }
      return false;
    }
    const { data: existingGame } = await axios.get(`/api/game/?id=${gameCode}`);
    if (!existingGame) {
      setError('gameCode', 'There is no game with that code');
      return false;
    }
    if (existingGame.playerIDs.length > 1) {
      setError('gameCode', 'This game already has 2 players');
      return false;
    }
    return true;
  };

  const handleJoinGame = async () => {
    const validated = await validate();
    if (validated) {
      const { gameCode, playerName } = formValues;
      onJoinGame(gameCode, playerName);
    }
  };

  const handleGameCodeChange = (event: ChangeEvent<HTMLInputElement>) => {
    setError('gameCode', '');
    setFormValue('gameCode', event.target.value);
  };

  const handlePlayerNameChange = (event: ChangeEvent<HTMLInputElement>) => {
    setError('playerName', '');
    setFormValue('playerName', event.target.value);
  };

  return (
    <div className="flex flex-col mt-4">
      <span>Join an existing game</span>
      <div className="flex flex-row space-x-2 mb-4 mt-2">
        <div className="flex flex-col space-y-2">
          <TextInput
            onChange={handleGameCodeChange}
            placeholder="Enter game code"
            errorText={errors.gameCode}
          />
          <TextInput
            onChange={handlePlayerNameChange}
            placeholder="Enter your player name"
            errorText={errors.playerName}
          />
        </div>
        <div className="flex items-end">
          <Button onClick={handleJoinGame}>Join Game</Button>
        </div>
      </div>
    </div>
  );
}
