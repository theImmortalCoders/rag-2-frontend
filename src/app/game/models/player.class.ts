import { TExchangeData } from './exchange-data.type';
import { PlayerSourceType } from './player-source-type.enum';

export class Player {
  public id: number;
  private _name: string;
  private isObligatory: boolean;
  private _playerType: PlayerSourceType;
  private isActive: boolean;
  private _inputData: TExchangeData = {};

  public constructor(
    id: number,
    isObligatory: boolean,
    name: string,
    playerType: PlayerSourceType = PlayerSourceType.KEYBOARD
  ) {
    this.isObligatory = isObligatory;
    this._name = name;
    this.id = id;
    this.isActive = isObligatory;
    this._playerType = playerType;
  }

  public get name(): string {
    return this._name;
  }

  public get playerType(): PlayerSourceType {
    return this._playerType;
  }

  public get obligatory(): boolean {
    return this.isObligatory;
  }

  public get active(): boolean {
    return this.isActive;
  }

  public set active(value: boolean) {
    this.isActive = value;
  }

  public get getPlayerType(): PlayerSourceType {
    return this._playerType;
  }

  public set setPlayerType(value: PlayerSourceType) {
    this._playerType = value;
  }

  public get inputData(): TExchangeData {
    return this._inputData;
  }

  public set inputData(value: TExchangeData) {
    this._inputData = value;
  }
}
