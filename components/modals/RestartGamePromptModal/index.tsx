import Button from '@/components/common/Button';
import { InjectCommonModalProps } from '@/constants/modals';
import { addPlayerToGame } from '@/services/game';
import { getPlayerById } from '@/services/player';
import XMarkIcon from '@heroicons/react/24/solid/XMarkIcon';
import { useRouter } from 'next/router';
import { useState } from 'react';

type RestartGamePromptModalProps = InjectCommonModalProps<{
  newGameId: string;
  fromPlayerName: string;
  onPlayAgain: () => void;
}>;

export default function RestartGamePromptModal({
  handleClose,
  newGameId,
  fromPlayerName,
  onPlayAgain,
}: RestartGamePromptModalProps) {
  const router = useRouter();
  const [isJoiningGame, setIsJoiningGame] = useState(false);

  const handlePlayAgain = async () => {
    const playerId = localStorage.getItem('playerId');
    if (playerId) {
      setIsJoiningGame(true);
      const player = await getPlayerById(playerId);
      await addPlayerToGame(newGameId, player);
      onPlayAgain();
      handleClose();
      setIsJoiningGame(false);
      router.push(`/${newGameId}`);
    }
  };

  return (
    <div className="relative text-black h-72 w-[22rem] rounded-lg border-0 bg-white p-4 shadow-lg">
      <XMarkIcon className="absolute top-4 right-4 w-6 h-6 cursor-pointer" onClick={handleClose} />
      <div className="flex flex-col items-center justify-center w-full">
        <h2 className="text-2xl">{fromPlayerName || 'Your opponent'} wants to play again!</h2>
      </div>
      <div className="w-full p-4 absolute bottom-0 left-0 flex justify-between">
        <Button onClick={handleClose} variant="secondary">
          Maybe next time
        </Button>
        <Button isLoading={isJoiningGame} onClick={handlePlayAgain}>
          Play again
        </Button>
      </div>
    </div>
  );
}
