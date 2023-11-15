import { Player } from '@prisma/client';
import axios from 'axios';
import useSWR from 'swr';

const fetcher = (url: string) => axios.get(url).then(res => res.data);

export default function usePlayers() {
  return useSWR<Player[]>('/api/player', fetcher);
}
