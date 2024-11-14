import { Game } from '@gameModels/game.class';
import { Pong } from '../games/pong/models/pong.class';
import { SkiJump } from '../games/ski-jump/models/ski-jump.class';
import { FlappyBird } from '../games/flappy-bird/models/flappy-bird.class';

export const games: Record<string, Game> = {
  pong: new Pong(),
  skijump: new SkiJump(),
  flappybird: new FlappyBird(),
};
