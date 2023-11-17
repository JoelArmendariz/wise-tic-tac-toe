import { GameWithPlayerObjects } from '@/types/gameTypes';
import axios from 'axios';
import useSWR from 'swr';

const fetcher = (url: string) => axios.get(url).then(res => res.data);

export default function useGame(id: string) {
  return useSWR<GameWithPlayerObjects>(`/api/game/?id=${id}`, fetcher);
}
