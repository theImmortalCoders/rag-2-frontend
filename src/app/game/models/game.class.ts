import { Type } from '@angular/core';
import { BaseGameWindowComponent } from '../games/base-game.component';
import { Player } from './player.class';

export class Game {
  private _name: string;
  private _gameWindowComponent: Type<BaseGameWindowComponent>;
  private _players: Player[];

  public constructor(
    name: string,
    gameWindowComponent: Type<BaseGameWindowComponent>,
    players: Player[]
  ) {
    this._name = name;
    this._gameWindowComponent = gameWindowComponent;
    this._players = players;
  }

  public getName(): string {
    return this._name;
  }

  public getGameWindowComponent(): Type<BaseGameWindowComponent> {
    return this._gameWindowComponent;
  }

  public getPlayers(): Player[] {
    return this._players;
  }
}
