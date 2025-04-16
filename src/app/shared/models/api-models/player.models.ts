import { PlayerSourceType, TExchangeData } from 'rag-2-games-lib';

export interface IPlayer {
  id: number;
  name: string;
  isObligatory: boolean;
  isActive: boolean;
  playerType: PlayerSourceType;
  inputData: TExchangeData;
  expectedDataDescription: string;
}
