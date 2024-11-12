import { TGameState } from '@gameModels/game-state.type';
import { Game } from '@gameModels/game.class';
import { Player } from '@gameModels/player.class';

export class SkiJumpState implements TGameState {
  public distance = 0;
  public jumperX = 0;
  public jumperY = 0;
  public jumperInclineRad = Math.PI / 2;
  public isMoving = false;
  public isFlying = false;
  public isLanded = false;
  public isCrashed = false;
  public jumperFlightVelocityX = 0;
  public jumperFlightVelocityY = 0;
  public stylePoints = 0;
  public windPoints = 0;
  public totalPoints = 0;
  public wind = 0;
  public windDirection = 'left';
}

export class SkiJump extends Game {
  public override name = 'skijump';
  public override state = new SkiJumpState();
  public override outputSpec = ``;
  public override players = [
    new Player(0, true, 'Player 1', { space: 0, up: 0, down: 0 }, '', {
      start: '[SPACE]',
      jump: '[SPACE]',
      land: '[SPACE]',
      restart: '[SPACE]',
      rotate_up: '[ARROW_DOWN]',
      rotate_down: '[ARROW_UP]',
    }),
  ];
}