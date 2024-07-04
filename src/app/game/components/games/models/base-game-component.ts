import { TExchangeData } from '../../../models/exchange-data.type';

export interface IBaseGameWindowComponent {
  gameWindowLogData: Record<string, TExchangeData>;
  gameWindowOutputData: TExchangeData;
  gameWindowInputData: TExchangeData;
}
