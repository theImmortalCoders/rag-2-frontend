import { inject, Injectable } from '@angular/core';
import { UserEndpointsService } from '@endpoints/user-endpoints.service';
import { TExchangeData } from '@gameModels/exchange-data.type';

@Injectable({
  providedIn: 'root',
})
export class AiSocketService {
  private _userEndpointsService = inject(UserEndpointsService);
  private _socket!: WebSocket;
  private isSocketConnected = false;
  private _sendingIntervalID: unknown | null = null;
  private isDataSendingActive = false;
  private _dataToSend: TExchangeData = {};
  public isDataExchangeDesired = false;

  public connect(
    socketUrl: string,
    onOpen: () => void,
    onMessage: (event: MessageEvent<string>) => void,
    onClose: () => void
  ): void {
    try {
      this._userEndpointsService.verifyJWTToken().subscribe({
        next: (isValid: boolean) => {
          if (isValid) {
            const urlWithJwt = `${socketUrl}?jwt=${localStorage.getItem('jwtToken')}`;
            this._socket = new WebSocket(urlWithJwt);
            this._socket.addEventListener('open', () => {
              this.isSocketConnected = true;
              onOpen();
            });
            this._socket.addEventListener('message', event => {
              onMessage(event);
            });
            this._socket.addEventListener('close', () => {
              this.stopDataExchange();
              this.isSocketConnected = false;
              onClose();
            });
          }
        },
        error: () => {
          this._userEndpointsService.logout();
        },
      });
    } catch (error) {
      this.stopDataExchange();
      this.isSocketConnected = false;
      onClose();
    }
  }

  public startDataExchange = (
    sendingInterval: number,
    expectedDataToReceive: TExchangeData,
    playerId: number
  ): void => {
    this.isDataExchangeDesired = true;
    this.resumeDataExchange(sendingInterval, expectedDataToReceive, playerId);
  };

  public stopDataExchange = (): void => {
    if (this._sendingIntervalID != null) {
      this.isDataExchangeDesired = false;
      this.pauseDataExchange();
    }
  };

  public pauseDataExchange = (): void => {
    this.isDataSendingActive = false;
    clearInterval(this._sendingIntervalID as number);
    console.log(
      'Data exchange stopped on interval: ',
      this._sendingIntervalID as number
    );
  };

  public resumeDataExchange = (
    sendingInterval: number,
    expectedDataToReceive: TExchangeData,
    playerId: number
  ): void => {
    if (!this.isDataExchangeDesired) return;
    this.isDataSendingActive = true;
    this._sendingIntervalID = setInterval(() => {
      this.sendDataToSocket(this._dataToSend, expectedDataToReceive, playerId);
    }, sendingInterval);
  };

  public getSocket(): WebSocket | null {
    return this._socket;
  }

  public getIsSocketConnected(): boolean {
    return this.isSocketConnected;
  }

  public getIsDataSendingActive(): boolean {
    return this.isDataSendingActive;
  }

  public setDataToSend(data: TExchangeData): void {
    this._dataToSend = data;
  }

  //

  private sendDataToSocket(
    dataToSend: TExchangeData,
    expectedDataToReceive: TExchangeData,
    playerId: number
  ): void {
    if (this._socket && this.isSocketConnected) {
      this._socket.send(
        JSON.stringify({
          name: dataToSend['name'],
          playerId: playerId,
          state: dataToSend['state'],
          players: dataToSend['players'],
          expectedInput: expectedDataToReceive,
        })
      );
      // console.log('Data sent', this._sendingIntervalID as number);
    }
  }
}
