import { Game, Player } from '@prisma/client';

export type GameWithPlayerObjects = Game & {
  players: Player[];
  owner: Player;
  currentPlayer: Player;
  winner: Player;
};
