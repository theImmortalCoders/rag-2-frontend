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

@Component({
  selector: 'app-ai-socket-menu',
  standalone: true,
  imports: [],
  template: `
    <div class=" border-2 border-solid border-red-600 p-5">
      <input
        class="border-2 border-solid border-black"
        #socketDomain
        type="text"
        list="recentPhrases" />
      <datalist id="recentPhrases">
        @for (phrase of recentPhrases; track phrase) {
          <option [value]="phrase"></option>
        }
      </datalist>
      <span
        [textContent]="isSocketConnected ? 'Connected' : 'Disconnected'"></span>
      <div>
        @if (isSocketConnected) {
          <button (click)="socket?.close()">Disconnect</button>
          @if (isDataSendingActive) {
            <button #dataCollectingButton (click)="stopDataExchange()">
              Stop data exchange
            </button>
          } @else {
            @if (gameDataSendingType === tGameDataSendingType.TimeGame) {
              <input
                type="number"
                #sendingIntervalInput
                class="border-2 border-solid border-black"
                min="10"
                max="1000"
                step="10"
                [defaultValue]="sendingInterval"
                (change)="
                  sendingInterval = sendingIntervalInput.valueAsNumber
                " />
            } @else {
              // Ready to send data //
            }
            <button #dataCollectingButton (click)="startDataExchange()">
              Start data exchange
            </button>
          }
        } @else {
          <button (click)="connect(socketDomain.value)">Connect</button>
        }
      </div>
    </div>
  `,
})
export class AiSocketMenuComponent implements OnInit, ILoggableDataComponent {
  private _dataToSend: TExchangeData = {};

  @Output() public logDataEmitter = new EventEmitter<TExchangeData>();
  @Output() public receivedDataEmitter = new EventEmitter<TExchangeData>();
  @Input({ required: true }) public gameDataSendingType: TGameDataSendingType =
    TGameDataSendingType.TimeGame;
  @Input({ required: true }) public set setDataToSend(value: TExchangeData) {
    this._dataToSend = value;
    if (this.gameDataSendingType === TGameDataSendingType.EventGame) {
      this.sendDataToSocket();
    }
  }

  public tGameDataSendingType = TGameDataSendingType;
  public socket: WebSocket | null = null;
  public recentPhrases: string[] = [];
  public isSocketConnected = false;
  public isDataSendingActive = false;
  public sendingInterval = 500;
  public sendingIntervalID: unknown | null = null;
  public logData: TExchangeData = {
    isSocketConnected: this.isSocketConnected,
    socketURL: '',
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

  public startDataExchange(): void {
    this.isDataSendingActive = true;
    this.sendingIntervalID = setInterval(() => {
      this.sendDataToSocket();
    }, this.sendingInterval);
    this.emitLogData();
  }

  public stopDataExchange(): void {
    if (this.sendingIntervalID != null) {
      this.isDataSendingActive = false;
      clearInterval(this.sendingIntervalID as number);
    }
  }

  //

  private sendDataToSocket(): void {
    if (this.socket && this.isSocketConnected) {
      this.socket.send(JSON.stringify(this._dataToSend));
      console.log('Data sent');
    }
  }

  private loadRecentPhrases(): void {
    const cachedPhrases = localStorage.getItem('recentPhrases');
    if (cachedPhrases) {
      this.recentPhrases = JSON.parse(cachedPhrases);
    }
  }

  private saveRecentPhrase(phrase: string): void {
    if (!this.recentPhrases.includes(phrase)) {
      this.recentPhrases.unshift(phrase);
      if (this.recentPhrases.length > 5) {
        this.recentPhrases.pop();
      }
      localStorage.setItem('recentPhrases', JSON.stringify(this.recentPhrases));
    }
  }

  private emitLogData(): void {
    this.logData['socketURL'] = this.socket?.url || '';
    this.logData['isSocketConnected'] = this.isSocketConnected;
    this.logData['sendingInterval'] = this.sendingInterval;
    this.logDataEmitter.emit(this.logData);
  }
}
