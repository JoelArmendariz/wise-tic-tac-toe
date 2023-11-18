import { Modals } from '@/constants/modals';
import { useModalContext } from '@/context/Modal/ModalProvider';
import ChartBarIcon from '@heroicons/react/24/solid/ChartBarIcon';

interface HeaderProps {
  showLeaderboard?: boolean;
}

export default function Header({ showLeaderboard }: HeaderProps) {
  const { showModal } = useModalContext();

  const handleOpenLeaderboard = () => {
    showModal(Modals.LEADERBOARD_MODAL);
  };

  return (
    <div className="relative h-16 bg-primary-gray-dark flex flex-row justify-center w-full p-4">
      <h1 className="text-2xl">WISE TIC TAC TOE</h1>
      {showLeaderboard ? (
        <ChartBarIcon
          className="absolute right-4 top-5 h-5 w-5 cursor-pointer hover:text-gray-300"
          onClick={handleOpenLeaderboard}
        />
      ) : null}
    </div>
  );
}
