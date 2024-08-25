import { Type } from '@angular/core';
import { TGameDataSendingType } from './game-data-sending-type.enum';
import { BaseGameWindowComponent } from '../components/games/base-game.component';
import { Player } from './player.class';

export class Game {
  private _name: string;
  private _gameWindowComponent: Type<BaseGameWindowComponent>;
  private _gameDataSendingType: TGameDataSendingType;
  private _players: Player[];

  public constructor(
    name: string,
    gameWindowComponent: Type<BaseGameWindowComponent>,
    gameDataSendingType: TGameDataSendingType,
    players: Player[]
  ) {
    this._name = name;
    this._gameWindowComponent = gameWindowComponent;
    this._gameDataSendingType = gameDataSendingType;
    this._players = players;
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

  public getPlayers(): Player[] {
    return this._players;
  }
}
