import { PongGameWindowComponent } from '../games/pong/pong.component';
import { Game } from '../models/game.class';
import { TictactoeGameWindowComponent } from '../games/tictactoe/tictactoe.component';
import { Player } from '../models/player.class';

export const games: Record<string, Game> = {
  pong: new Game('pong', PongGameWindowComponent, [
    new Player(1, true, 'Player 1'),
    new Player(2, true, 'Player 2'),
  ]),
  tictactoe: new Game('tictactoe', TictactoeGameWindowComponent, [
    new Player(1, true, 'Player 1'),
    new Player(2, true, 'Player 2'),
  ]),
};