import { GameWithPlayerObjects } from '@/types/gameTypes';
import { Game, Player } from '@prisma/client';
import { fetchGet, fetchPost, fetchPut } from './common';

export const getGameById = (gameId: string): Promise<GameWithPlayerObjects> =>
  fetchGet(`/api/game/?id=${gameId}`);

export const setGameOver = (gameId: string, winnerID?: string) =>
  fetchPost('/api/gameover', { gameId, winnerID });

export const updateGameBoard = (gameId: string, board: string) =>
  fetchPost('/api/move', { gameId, board });

export const createGameByPlayer = (player: Player): Promise<GameWithPlayerObjects> =>
  fetchPost('/api/game', player);

export const addPlayerToGame = (gameId: string, player: Player): Promise<Game> =>
  fetchPut('/api/game', { player, gameId });
