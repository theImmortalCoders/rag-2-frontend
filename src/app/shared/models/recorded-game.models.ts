import { TExchangeData } from '@gameModels/exchange-data.type';
import { IPlayer } from './player.models';
export interface IRecordedGameResponse {
  id: number;
  players: IPlayer[];
  started: string;
  ended: string;
  outputSpec: string;
  endState: TExchangeData;
}

export interface IRecordedGameRequest {
  gameName: string;
  values: TExchangeData[];
}
