import { TGameState } from '@gameModels/game-state.type';
import { Game } from '@gameModels/game.class';
import { Player } from '@gameModels/player.class';

export class HappyJumpState implements TGameState {
  public playerX = 400; // Pozycja X gracza
  public playerY = 300; // Pozycja Y gracza
  public playerSpeedX = 0; // Prędkość w poziomie
  public playerSpeedY = 0; // Prędkość w pionie
  public gravity = 0.5; // Grawitacja
  public jumpPowerY = -10; // Siła skoku
  public platformSpeed = 2; // Prędkość przesuwania platform w dół
  public score = 0; // Wynik punktowy
  public platforms = Array.from({ length: 5 }, (_, i) => ({
    x: Math.random() * 800, // Losowa pozycja X platformy
    y: i * 120, // Ustawienie platform na różnych wysokościach
  }));
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

      default values:
        playerX: 400;
        playerY: 300;
        playerSpeedX: 0;
        playerSpeedY: 0;
        gravity: 0.5;
        jumpPowerY: -10;
        platformSpeed: 2;
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
      '<left>: value of {0, 1}, move left; <right>: value of {0, 1}, move right; <jump>: value of {0, 1}, perform jump',
      { left: '[ARROW_LEFT]', right: '[ARROW_RIGHT]', jump: '[SPACE]' }
    ),
  ];
}
