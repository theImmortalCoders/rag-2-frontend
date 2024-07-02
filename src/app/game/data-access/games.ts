import { PongGameWindowComponent } from '../components/games/pong/pong.component';
import { TetrisGameWindowComponent } from '../components/games/tetris/tetris.component';
import { Game } from '../models/game';
import { TGameDataSendingType } from '../models/game-data-sending-type';

export const games: Record<string, Game> = {
  pong: new Game(
    'pong',
    PongGameWindowComponent,
    TGameDataSendingType.TimeGame
  ),
  tetris: new Game(
    'tetris',
    TetrisGameWindowComponent,
    TGameDataSendingType.EventGame
  ),
};
