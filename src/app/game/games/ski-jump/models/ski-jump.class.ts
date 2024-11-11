import { TGameState } from '@gameModels/game-state.type';
import { Game } from '@gameModels/game.class';
import { Player } from '@gameModels/player.class';

export class SkiJumpState implements TGameState {
  public distance = 0;
  public jumperX = 0;
  public jumperY = 0;
  public isJumping = false;
  public jumperVelocityX = 0;
  public jumperVelocityY = 0;
  public wind = 0;
  public windDirection = 'left';
}

export class SkiJump extends Game {
  public override name = 'skijump';
  public override state = new SkiJumpState();
  public override outputSpec = ``;
  public override players = [
    new Player(0, true, 'Player 1', { space: 0, up: 0, down: 0 }, ''),
  ];
}
