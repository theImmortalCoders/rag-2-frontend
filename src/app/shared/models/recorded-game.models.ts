import { TExchangeData } from '@gameModels/exchange-data.type';
import { IPlayer } from './player.models';
export interface IRecordedGameResponse {
  id: number;
  gameName: string;
  players: IPlayer[];
  started: string;
  ended: string;
  outputSpec: string;
  endState: TExchangeData;
  sizeMb: number;
}

export interface IRecordedGameRequest {
  gameName: string;
  values: TExchangeData[];
}
