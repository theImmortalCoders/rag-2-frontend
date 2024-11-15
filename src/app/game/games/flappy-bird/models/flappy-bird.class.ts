import { TGameState } from '@gameModels/game-state.type';
import { Game } from '@gameModels/game.class';
import { Player } from '@gameModels/player.class';

export class FlappyBirdState implements TGameState {
  public birdY = 0;
  public birdSpeedY = 0;
  public gravity = 0;
  public jumpPowerY = 0;
  public obstacleSpeed = 0;
  public score = 0;
  public difficulty = 0;
  public obstacles = Array.from({ length: 4 }, () => ({
    distanceX: 0,
    centerGapY: 0,
  }));
  public isGameStarted = false;
}

export class FlappyBird extends Game {
  public override name = 'flappybird';
  public override state = new FlappyBirdState();
  public override outputSpec = `
        output:
          birdY: float, <0, 600>;
          birdSpeedY: float, <-inf, inf>;
          gravity: float, <0.5, 1>;
          jumpPowerY: float, <5, 15>;
          obstacleSpeed = <2, 10>;
          score: int, <0, inf>;
          difficulty: int, <0, inf>;
          obstacles: [{distanceX: int, <0, 1900>, centerGapyY: int <100, 500>}];
          isGameStarted: boolean;
  
        default values:
          birdY: 300;
          birdSpeedY: 0;
          gravity: 0.5;
          jumpPowerY: 10;
          obstacleSpeed: 2;
          score: 0;
          difficulty: 1;
          isGameStarted: false;
      `;

  public override players = [
    new Player(
      0,
      true,
      'Player 1',
      { jump: false },
      { ' ': 'jump' },
      '<jump>:  value of {0, 1}, 0: stop, 1: jump',
      { jump: '[SPACE]', start: '[SPACE]' }
    ),
  ];
}
