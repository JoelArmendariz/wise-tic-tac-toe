import { Game, Player } from '@prisma/client';
import axios from 'axios';
import useSWR from 'swr';

const fetcher = (url: string) => axios.get(url).then(res => res.data);

export default function useGame(id: string) {
  return useSWR<Game & { owner: Player; currentPlayer: Player; players: Player[] }>(
    `/api/game/?id=${id}`,
    fetcher
  );
}
