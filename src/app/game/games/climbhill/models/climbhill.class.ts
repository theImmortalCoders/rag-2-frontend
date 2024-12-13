import { TGameState } from '@gameModels/game-state.type';
import { Game } from '@gameModels/game.class';
import { Player } from '@gameModels/player.class';

export class ClimbHillState implements TGameState {
  public score = 0;
}

export class ClimbHill extends Game {
  public override name = 'climbhill';
  public override state = new ClimbHillState();
  public override outputSpec = ``;

  public override players = [
    new Player(
      0,
      true,
      'Player 1',
      { gas: 0, brake: 0 },
      {
        ArrowRight: {
          variableName: 'gas',
          pressedValue: 1,
          releasedValue: 0,
        },
        ArrowLeft: {
          variableName: 'brake',
          pressedValue: 1,
          releasedValue: 0,
        },
      },
      '<gas>, <brake>:  value of {0, 1}, 0: gas/brake released, 1: gas/brake pressed',
      { gas: '[ArrowRight]', brake: '[ArrowLeft]' }
    ),
  ];
}
