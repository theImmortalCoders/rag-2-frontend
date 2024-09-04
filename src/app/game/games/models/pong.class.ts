import { TGameState } from 'app/game/models/game-state.type';
import { Game } from 'app/game/models/game.class';
import { Player } from 'app/game/models/player.class';

class PongState implements TGameState {
  public leftPadleY = 0;
  public rightPadleY = 0;
  public leftPaddleSpeed = 0;
  public rightPaddleSpeed = 0;
  public ballX = 0;
  public ballY = 0;
  public ballSpeedX = 0;
  public ballSpeedY = 0;
  public ballSpeedMultiplier = 1;
  public scoreLeft = 0;
  public scoreRight = 0;
}

export class Pong extends Game {
  public override name = 'pong';
  public override state = new PongState();
  public override outputSpec = `
      output:
        leftPadleY: number, <0, 600>;
        rightPadleY: number, <0, 600>;
        leftPaddleSpeed: number, <-20, 20>;
        rightPaddleSpeed: number, <-20, 20>;
        ballX: number, <0, 1000>;
        ballY: number, <0, 600>;
        ballSpeedX: number, <-inf, inf>;
        ballSpeedY: number, <-inf, inf>;
        ballSpeedMultiplier: number, <1, inf>;
        scoreLeft: number, <0, inf>;
        scoreRight: number, <0, inf>;
  
      default values:
        ballX: 500;
        ballY: 300;
        leftPadleY: 250;
        rightPadleY: 250;
    `;
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
