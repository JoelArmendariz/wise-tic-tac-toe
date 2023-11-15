import { Modals } from '@/constants/modals';
import { useModalContext } from '@/context/Modal/ModalProvider';
import ChartBarIcon from '@heroicons/react/24/solid/ChartBarIcon';

export default function Header() {
  const { showModal } = useModalContext();

  const handleOpenLeaderboard = () => {
    showModal(Modals.LEADERBOARD);
  };

  return (
    <div className="relative bg-primary-gray-dark flex flex-row justify-center w-full p-4">
      <h1 className="text-2xl">WISE TIC TAC TOE</h1>
      <ChartBarIcon
        className="absolute right-4 top-5 h-5 w-5 cursor-pointer hover:text-gray-300"
        onClick={handleOpenLeaderboard}
      />
    </div>
  );
}
