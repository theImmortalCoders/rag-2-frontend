import { inject, Injectable } from '@angular/core';
import { AuthEndpointsService } from '@endpoints/auth-endpoints.service';
import { TExchangeData } from '@gameModels/exchange-data.type';
import { NotificationService } from 'app/shared/services/notification.service';

@Injectable({
  providedIn: 'root',
})
export class AiSocketService {
  private _authEndpointsService = inject(AuthEndpointsService);
  private _socket!: WebSocket;
  private isSocketConnected = false;
  private _sendingIntervalID: unknown | null = null;
  private isDataSendingActive = false;
  private _dataToSend: TExchangeData = {};
  private _previousData = '';
  private _notificationService = inject(NotificationService);

  public isDataExchangeDesired = false;

  public connect(
    socketUrl: string,
    onOpen: () => void,
    onMessage: (event: MessageEvent<string>) => void,
    onClose: () => void
  ): void {
    this._authEndpointsService.verifyJWTToken().subscribe({
      next: (isValid: boolean) => {
        if (isValid) {
          socketUrl = `${socketUrl}?jwt=${localStorage.getItem('jwtToken')}`;
        }
        this.defineSocket(socketUrl, onOpen, onMessage, onClose);
      },
      error: () => {
        this.defineSocket(socketUrl, onOpen, onMessage, onClose);
      },
    });
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

  public closeSocket(): void {
    this.stopDataExchange();
    this.isSocketConnected = false;
    if (this._socket) {
      this._socket.close();
    }
  }

  //

  private defineSocket(
    socketUrl: string,
    onOpen: () => void,
    onMessage: (event: MessageEvent<string>) => void,
    onClose: () => void
  ): void {
    this._socket = new WebSocket(socketUrl);
    this._socket.addEventListener('open', () => {
      this.isSocketConnected = true;
      onOpen();
    });
    this._socket.addEventListener('message', event => {
      onMessage(event);
    });
    this._socket.addEventListener('close', e => {
      if (e.code === 401) {
        this._notificationService.addNotification(
          'Max guest users limit reached. Log in to play or try again later.',
          5000
        );
      }
      this.stopDataExchange();
      this.isSocketConnected = false;
      onClose();
    });
  }

  private sendDataToSocket(
    dataToSend: TExchangeData,
    expectedDataToReceive: TExchangeData,
    playerId: number
  ): void {
    if (this._socket && this.isSocketConnected) {
      const data: string = JSON.stringify({
        name: dataToSend['name'],
        playerId: playerId,
        state: dataToSend['state'],
        players: dataToSend['players'],
        expectedInput: expectedDataToReceive,
      });

      if (data != this._previousData) {
        this._socket.send(data);
      }

      this._previousData = data;
    }
  }
}
