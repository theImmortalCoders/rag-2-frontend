import { Game } from '@gameModels/game.class';
import { Pong } from '../games/pong/models/pong.class';

export const games: Record<string, Game> = {
  pong: new Pong(),
};
