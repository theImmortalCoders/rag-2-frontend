import { Pong } from '../games/models/pong.class';
import { Game } from '../models/game.class';

export const games: Record<string, Game> = {
  pong: new Pong(),
};
