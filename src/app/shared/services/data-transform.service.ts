import { Injectable } from '@angular/core';
import { TExchangeData } from 'rag-2-games-lib';

@Injectable({
  providedIn: 'root',
})
export class DataTransformService {
  public exchangeDataToCsv(data: TExchangeData[]): string {
    const header = Object.keys(data[0]).join(',');
    const rows = data.map(row => Object.values(row).join(','));
    return `${header}\n${rows.join('\n')}`;
  }
}
