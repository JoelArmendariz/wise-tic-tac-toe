import { getAllPlayers } from '@/services/player';
import { Player } from '@prisma/client';
import useSWR from 'swr';

export default function usePlayers() {
  return useSWR<Player[]>('GET_ALL_PLAYERS', getAllPlayers);
}
