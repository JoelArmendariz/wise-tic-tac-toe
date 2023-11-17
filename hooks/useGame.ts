import { getGameById } from '@/services/game';
import { GameWithPlayerObjects } from '@/types/gameTypes';
import useSWR from 'swr';

export default function useGame(id: string) {
  return useSWR<GameWithPlayerObjects>(id, getGameById);
}
