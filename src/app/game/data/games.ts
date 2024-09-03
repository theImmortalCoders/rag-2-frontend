import { PongGameWindowComponent } from '../games/pong/pong.component';
import { Game } from '../models/game.class';
import { TictactoeGameWindowComponent } from '../games/tictactoe/tictactoe.component';
import { Player } from '../models/player.class';

export class Pong extends Game {
  public leftPadleY = 0;
  public rightPadleY = 0;
  public leftPaddleSpeed = 0;
  public rightPaddleSpeed = 0;
  public override players = [
    new Player(
      1,
      true,
      'Player 1',
      { move: 0 },
      'Value of {-1, 0, 1}, -1: down, 0: stop, 1: up'
    ),
    new Player(
      2,
      true,
      'Player 2',
      { move: 0 },
      'Value of {-1, 0, 1}, -1: down, 0: stop, 1: up'
    ),
  ];
}

export class TicTacToe extends Game {
  public leftPadleY = 0;
}

//

export const games: Record<string, Game> = {
  pong: new Pong('pong', PongGameWindowComponent),
  tictactoe: new TicTacToe('tictactoe', TictactoeGameWindowComponent),
};
