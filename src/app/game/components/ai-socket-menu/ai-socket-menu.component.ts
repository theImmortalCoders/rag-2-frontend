import {
  Component,
  DoCheck,
  EventEmitter,
  Input,
  OnInit,
  Output,
} from '@angular/core';
import { TExchangeData } from '../../models/exchange-data.type';
import { ILoggableDataComponent } from '../../models/loggable-data-component';
import { TGameDataSendingType } from '../../models/game-data-sending-type.enum';
import { SocketDomainInputComponent } from './components/socket-domain-input/socket-domain-input.component';
import { SocketConnectedMenuComponent } from './components/socket-connected-menu/socket-connected-menu.component';

@Component({
  selector: 'app-ai-socket-menu',
  standalone: true,
  imports: [SocketDomainInputComponent, SocketConnectedMenuComponent],
  template: `
    <div class=" border-2 border-solid border-red-600 p-5">
      <app-socket-domain-input
        (socketDomainEmitter)="socketUrl = $event"
        [recentPhrases]="recentPhrases"></app-socket-domain-input>
      <span
        [textContent]="isSocketConnected ? 'Connected' : 'Disconnected'"></span>
      <div>
        @if (isSocketConnected) {
          <button (click)="socket?.close()">Disconnect</button>
          @if (gameDataSendingType === tGameDataSendingType.TimeGame) {
            <app-socket-connected-menu
              [isDataSendingActive]="isDataSendingActive"
              [sendingInterval]="sendingInterval"
              [socket]="socket"
              [startDataExchange]="startDataExchange"
              [stopDataExchange]="stopDataExchange"></app-socket-connected-menu>
          }
        } @else {
          <button (click)="connect(socketUrl)">Connect</button>
        }
      </div>
    </div>
  `,
})
export class AiSocketMenuComponent implements OnInit, ILoggableDataComponent {
  private _dataToSend: TExchangeData = {};

  @Input({ required: true }) public gameName = '';
  @Input({ required: true }) public gameDataSendingType: TGameDataSendingType =
    TGameDataSendingType.TimeGame;
  @Input({ required: true }) public set setDataToSend(value: TExchangeData) {
    this._dataToSend = value;
    if (this.gameDataSendingType === TGameDataSendingType.EventGame) {
      this.sendDataToSocket();
    }
  }

  @Output() public logDataEmitter = new EventEmitter<TExchangeData>();
  @Output() public receivedDataEmitter = new EventEmitter<TExchangeData>();

  public socket: WebSocket | null = null;
  public recentPhrases: string[] = [];
  public isSocketConnected = false;
  public isDataSendingActive = false;
  public sendingInterval = 500;
  public sendingIntervalID: unknown | null = null;
  public socketUrl = '';
  public tGameDataSendingType = TGameDataSendingType;
  public logData: TExchangeData = {
    isSocketConnected: this.isSocketConnected,
    socketURL: this.socketUrl,
    sendingInterval: this.sendingInterval,
  };

  public ngOnInit(): void {
    this.logDataEmitter.emit(this.logData);
    this.loadRecentPhrases();
  }

  public connect(socketDomain: string): void {
    try {
      this.socket = new WebSocket(socketDomain);
      this.socket.addEventListener('open', () => {
        this.isSocketConnected = true;
        this.saveRecentPhrase(socketDomain);
        this.emitLogData();
      });
      this.socket.addEventListener('message', event => {
        this.receivedDataEmitter.emit(JSON.parse(event.data));
      });
      this.socket.addEventListener('close', () => {
        this.isSocketConnected = false;
        this.stopDataExchange();
        this.emitLogData();
      });
    } catch (error) {
      this.isSocketConnected = false;
      this.stopDataExchange();
      this.emitLogData();
    }
  }

  public startDataExchange = (): void => {
    this.isDataSendingActive = true;
    this.sendingIntervalID = setInterval(() => {
      this.sendDataToSocket();
    }, this.sendingInterval);
    this.emitLogData();
  };

  public stopDataExchange = (): void => {
    if (this.sendingIntervalID != null) {
      this.isDataSendingActive = false;
      clearInterval(this.sendingIntervalID as number);
    }
  };

  //

  private sendDataToSocket(): void {
    if (this.socket && this.isSocketConnected) {
      this.socket.send(JSON.stringify(this._dataToSend));
      console.log('Data sent');
    }
  }

  private loadRecentPhrases(): void {
    const cachedPhrases = localStorage.getItem(
      'recentPhrases_' + this.gameName
    );
    if (cachedPhrases) {
      this.recentPhrases = JSON.parse(cachedPhrases);
    }
  }

  private saveRecentPhrase(phrase: string): void {
    if (this.recentPhrases.includes(phrase)) return;
    this.recentPhrases.unshift(phrase);

    if (this.recentPhrases.length > 5) {
      this.recentPhrases.pop();
    }

    localStorage.setItem(
      'recentPhrases_' + this.gameName,
      JSON.stringify(this.recentPhrases)
    );
  }

  private emitLogData(): void {
    this.logData['socketURL'] = this.socket?.url || '';
    this.logData['isSocketConnected'] = this.isSocketConnected;
    this.logData['sendingInterval'] = this.sendingInterval;
    this.logDataEmitter.emit(this.logData);
  }
}
