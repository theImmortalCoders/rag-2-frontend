import { Type } from '@angular/core';
import { TGameDataSendingType } from './game-data-sending-type.enum';
import { IBaseGameWindowComponent } from '../components/games/models/base-game-component';

export class Game {
  private _name: string;
  private _gameWindowComponent: Type<IBaseGameWindowComponent>;
  private _gameDataSendingType: TGameDataSendingType;

  public constructor(
    name: string,
    gameWindowComponent: Type<IBaseGameWindowComponent>,
    gameDataSendingType: TGameDataSendingType
  ) {
    this._name = name;
    this._gameWindowComponent = gameWindowComponent;
    this._gameDataSendingType = gameDataSendingType;
  }

  public getName(): string {
    return this._name;
  }

  public getGameWindowComponent(): Type<IBaseGameWindowComponent> {
    return this._gameWindowComponent;
  }

  public getGameDataSendingType(): TGameDataSendingType {
    return this._gameDataSendingType;
  }
}
