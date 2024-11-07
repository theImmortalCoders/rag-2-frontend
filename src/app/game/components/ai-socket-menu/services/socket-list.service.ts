import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class SocketListService {
  private _socketList: string[] = [];

  public addToList(socketUrl: string): void {
    if (this._socketList.includes(socketUrl)) return;
    this._socketList.push(socketUrl);
  }

  public removeFromList(socketUrl: string): void {
    this._socketList = this._socketList.filter(url => url !== socketUrl);
  }

  public clearList(): void {
    this._socketList = [];
  }

  public getSocketList(): string[] {
    return this._socketList;
  }
}
