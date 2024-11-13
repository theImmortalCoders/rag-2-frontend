import { TGameState } from '@gameModels/game-state.type';
import { Game } from '@gameModels/game.class';
import { Player } from '@gameModels/player.class';

export class FlappyBirdState implements TGameState {
  public birdY = 0;
  public birdSpeedY = 0;
  public gravity = 0;
  public jumpPowerY = 0;
  public obstacleDistanceX = 300;
  public obstacleCenterGapY = 150;
  public score = 0;
  public isGameActive = false;
}

export class FlappyBird extends Game {
  public override name = 'flappybird';
  public override state = new FlappyBirdState();
  public override outputSpec = `
        output:
          birdY: float, <0, 600>;
          birdSpeedY: float, <-inf, inf>;
          gravity: float, <0.5, inf>;
          jumpPowerY: float, <-inf, -5>;
          obstacleDistanceX: int, <0, 500>;
          obstacleCenterGapY: int, <50, 550>;
          score: int, <0, inf>;
          isGameActive: boolean;
  
        default values:
          birdY: 300;
          birdSpeedY: 0;
          obstacleDistanceX: 300;
          obstacleCenterGapY: 200;
          gravity: 0.5;
          jumpPowerY: 10
      `;

  public override players = [
    new Player(
      0,
      true,
      'Player 1',
      { jump: 0 },
      '<jump>:  value of {0, 1}, 0: stop, 1: jump',
      { jump: '[SPACE]' }
    ),
  ];
}
