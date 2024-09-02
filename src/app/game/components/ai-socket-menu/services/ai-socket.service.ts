import { Injectable } from '@angular/core';
import { TExchangeData } from '../../../models/exchange-data.type';

@Injectable({
  providedIn: 'root',
})
export class AiSocketService {
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
      this._socket = new WebSocket(socketUrl);
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
    } catch (error) {
      this.stopDataExchange();
      this.isSocketConnected = false;
      onClose();
    }
  }

  public startDataExchange = (
    sendingInterval: number,
    expectedDataToReceive: TExchangeData,
    expectedDataDescription: string
  ): void => {
    this.isDataExchangeDesired = true;
    this.resumeDataExchange(
      sendingInterval,
      expectedDataToReceive,
      expectedDataDescription
    );
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
  };

  public resumeDataExchange = (
    sendingInterval: number,
    expectedDataToReceive: TExchangeData,
    expectedDataDescription: string
  ): void => {
    if (!this.isDataExchangeDesired) return;
    this.isDataSendingActive = true;
    this._sendingIntervalID = setInterval(() => {
      this.sendDataToSocket(
        this._dataToSend,
        expectedDataToReceive,
        expectedDataDescription
      );
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
    expectedDataDescription: string
  ): void {
    if (this._socket && this.isSocketConnected) {
      this._socket.send(
        JSON.stringify({
          output: dataToSend,
          expected_input: expectedDataToReceive,
          expected_input_description: expectedDataDescription,
        })
      );
      console.log('Data sent');
    }
  }
}
