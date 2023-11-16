import GameCodeForm from '@/components/GameCodeForm';
import Header from '@/components/common/Header';

export default function Home() {
  return (
    <div>
      <Header showLeaderboard />
      <main className="flex flex-col h-[calc(100%_-_4rem)] items-center">
        <GameCodeForm />
      </main>
    </div>
  );
}
