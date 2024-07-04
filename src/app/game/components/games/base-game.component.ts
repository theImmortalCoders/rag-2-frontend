import { TExchangeData } from '../../models/exchange-data.type';

export class BaseGameWindowComponent {
  public gameWindowLogData: Record<string, TExchangeData> = {};
  public gameWindowOutputData: TExchangeData = {};
  public gameWindowInputData: TExchangeData = {};
}
