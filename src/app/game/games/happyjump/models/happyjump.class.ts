import { TGameState } from '@gameModels/game-state.type';
import { Game } from '@gameModels/game.class';
import { Player } from '@gameModels/player.class';

export class HappyJumpState implements TGameState {
  public playerX = 400;
  public playerY = 300;
  public playerSpeedX = 0;
  public playerSpeedY = 0;
  public gravity = 0.5;
  public jumpPowerY = -10;
  public platformSpeed = 2;
  public score = 0;
  public platforms = Array.from({ length: 5 }, (_, i) => ({
    x: Math.random() * 800,
    y: i * 120,
  }));
  public isGameStarted = false;
  public failCounter = 0;
}

export class HappyJump extends Game {
  public override name = 'happyjump';
  public override state = new HappyJumpState();

  public override outputSpec = `
      output:
        playerX: float, <0, 800>;
        playerY: float, <0, 600>;
        playerSpeedX: float, <-inf, inf>;
        playerSpeedY: float, <-inf, inf>;
        gravity: float, <0, inf>;
        jumpPowerY: float, <-inf, 0>;
        platformSpeed: float, <0, inf>;
        score: int, <0, inf>;
        platforms: [{ x: float, <0, 800>, y: float, <0, 600> }];
        isGameStarted: boolean;
        failCounter: int, <0, inf>

      default values:
        playerX: 400;
        playerY: 300;
        playerSpeedX: 0;
        playerSpeedY: 0;
        gravity: 0.5;
        jumpPowerY: -10;
        platformSpeed: 2;
        isGameStarted: false;
        failCounter: 0;
    `;

  public override players = [
    new Player(
      0,
      true,
      'Player 1',
      { left: 0, right: 0, jump: 0 },
      {
        ArrowLeft: { variableName: 'left', pressedValue: 1, releasedValue: 0 },
        ArrowRight: {
          variableName: 'right',
          pressedValue: 1,
          releasedValue: 0,
        },
        ' ': { variableName: 'jump', pressedValue: 1, releasedValue: 0 },
      },
      '<left>: value of {0, 1}, move left; <right>: value of {0, 1}, move right; <jump>, <start>:  value of {0, 1}, 0: not jump, 1: jump',
      {
        left: '[ARROW_LEFT]',
        right: '[ARROW_RIGHT]',
        jump: '[SPACE]',
        start: '[SPACE]',
      }
    ),
  ];
}
