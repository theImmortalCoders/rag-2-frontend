import { Type } from '@angular/core';
import { TGameDataSendingType } from './game-data-sending-type.enum';
import { BaseGameWindowComponent } from '../components/games/models/base-game.component';

export class Game {
  private _name: string;
  private _gameWindowComponent: Type<BaseGameWindowComponent>;
  private _gameDataSendingType: TGameDataSendingType;

  public constructor(
    name: string,
    gameWindowComponent: Type<BaseGameWindowComponent>,
    gameDataSendingType: TGameDataSendingType
  ) {
    this._name = name;
    this._gameWindowComponent = gameWindowComponent;
    this._gameDataSendingType = gameDataSendingType;
  }

  public getName(): string {
    return this._name;
  }

  public getGameWindowComponent(): Type<BaseGameWindowComponent> {
    return this._gameWindowComponent;
  }

  public getGameDataSendingType(): TGameDataSendingType {
    return this._gameDataSendingType;
  }
}
