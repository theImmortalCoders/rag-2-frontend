import { Type } from '@angular/core';
import { BaseGameWindowComponent } from '../components/games/base-game.component';
import { TGameDataSendingType } from './game-data-sending-type';

export class Game {
  private name: string;
  private gameWindowComponent: Type<BaseGameWindowComponent>;
  private gameDataSendingType: TGameDataSendingType;

  constructor(
    name: string,
    gameWindowComponent: Type<BaseGameWindowComponent>,
    gameDataSendingType: TGameDataSendingType
  ) {
    this.name = name;
    this.gameWindowComponent = gameWindowComponent;
    this.gameDataSendingType = gameDataSendingType;
  }

  public getName(): string {
    return this.name;
  }

  public getGameWindowComponent(): Type<BaseGameWindowComponent> {
    return this.gameWindowComponent;
  }

  public getGameDataSendingType(): TGameDataSendingType {
    return this.gameDataSendingType;
  }
}
