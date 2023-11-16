import { ChangeEvent, useState } from 'react';
import TextInput from '@/components/common/TextInput';
import Button from '@/components/common/Button';

interface CreateNewGameFormProps {
  onCreateNewGame: (playerName: string) => void;
}

export default function CreateNewGameForm({ onCreateNewGame }: CreateNewGameFormProps) {
  const [inputValue, setInputValue] = useState('');
  const [inputError, setInputError] = useState('');

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    setInputError('');
    setInputValue(event.target.value);
  };

  const handleCreateNewGame = () => {
    if (!inputValue) {
      setInputError('Please enter a player name!');
      return;
    }
    onCreateNewGame(inputValue);
  };

  return (
    <div className="flex flex-col mb-4">
      <span>Create a new game</span>
      <div className="flex flex-row space-x-2 mt-2">
        <TextInput
          onChange={handleChange}
          placeholder="Enter your player name"
          errorText={inputError}
        />
        <Button className="h-10" onClick={handleCreateNewGame}>
          New Game
        </Button>
      </div>
    </div>
  );
}
