import { Player } from '@prisma/client';
import { fetchGet, fetchPost } from './common';

export const getPlayerById = (playerId: string): Promise<Player> =>
  fetchGet(`/api/player/?id=${playerId}`);

export const getOrCreatePlayerByName = (playerName: string): Promise<Player> =>
  fetchPost('/api/player', { name: playerName });
