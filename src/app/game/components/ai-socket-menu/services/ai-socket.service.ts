import { Injectable } from '@angular/core';
import { TExchangeData } from '../../../models/exchange-data.type';
import { E } from '@angular/cdk/keycodes';

@Injectable({
  providedIn: 'root',
})
export class AiSocketService {
  private _socket!: WebSocket;
  private isSocketConnected = false;
  private _sendingIntervalID: unknown | null = null;
  private isDataSendingActive = false;

  public sendDataToSocket(
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
    dataToSend: TExchangeData,
    expectedDataToReceive: TExchangeData,
    expectedDataDescription: string
  ): void => {
    console.log(sendingInterval);
    this.isDataSendingActive = true;
    this._sendingIntervalID = setInterval(() => {
      this.sendDataToSocket(
        dataToSend,
        expectedDataToReceive,
        expectedDataDescription
      );
    }, sendingInterval);
  };

  public stopDataExchange = (): void => {
    if (this._sendingIntervalID != null) {
      this.isDataSendingActive = false;
      clearInterval(this._sendingIntervalID as number);
    }
  };

  //

  public getSocket(): WebSocket | null {
    return this._socket;
  }

  public getIsSocketConnected(): boolean {
    return this.isSocketConnected;
  }

  public getIsDataSendingActive(): boolean {
    return this.isDataSendingActive;
  }

  public getSendingInterval(): number {
    return this._sendingIntervalID as number;
  }
}
