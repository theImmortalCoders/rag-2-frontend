import { KeyValueDiffer, KeyValueDiffers, Type } from '@angular/core';
import { BaseGameWindowComponent } from '../games/base-game.component';
import { Player } from './player.class';

export abstract class Game {
  public name: string;
  public gameWindowComponent: Type<BaseGameWindowComponent>;
  public players: Player[] = [];

  public constructor(
    name: string,
    gameWindowComponent: Type<BaseGameWindowComponent>
  ) {
    this.name = name;
    this.gameWindowComponent = gameWindowComponent;
  }
}
