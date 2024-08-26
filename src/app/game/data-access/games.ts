import { PongGameWindowComponent } from '../components/games/pong/pong.component';
import { Game } from '../models/game.class';
import { TGameDataSendingType } from '../models/game-data-sending-type.enum';
import { TictactoeGameWindowComponent } from '../components/games/tictactoe/tictactoe.component';
import { Player } from '../models/player.class';

export const games: Record<string, Game> = {
  pong: new Game(
    'pong',
    PongGameWindowComponent,
    TGameDataSendingType.TimeGame,
    [new Player(1, true, 'Player 1'), new Player(2, true, 'Player 2')]
  ),
  tictactoe: new Game(
    'tictactoe',
    TictactoeGameWindowComponent,
    TGameDataSendingType.EventGame,
    [new Player(1, true, 'Player 1'), new Player(2, true, 'Player 2')]
  ),
};
