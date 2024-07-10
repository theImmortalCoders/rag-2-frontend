import { PongGameWindowComponent } from '../components/games/pong/pong.component';
import { Game } from '../models/game.class';
import { TGameDataSendingType } from '../models/game-data-sending-type.enum';
import { TictactoeGameWindowComponent } from '../components/games/tictactoe/tictactoe.component';

export const games: Record<string, Game> = {
  pong: new Game(
    'pong',
    PongGameWindowComponent,
    TGameDataSendingType.TimeGame
  ),
  tictactoe: new Game(
    'tictactoe',
    TictactoeGameWindowComponent,
    TGameDataSendingType.EventGame
  ),
};
