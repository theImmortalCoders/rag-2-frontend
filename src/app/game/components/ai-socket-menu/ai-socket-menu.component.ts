import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { TExchangeData } from '../../models/exchange-data.type';
import { ILoggableDataComponent } from '../../models/loggable-data-component';
import { TGameDataSendingType } from '../../models/game-data-sending-type.enum';
import { SocketDomainInputComponent } from './components/socket-domain-input/socket-domain-input.component';
import { SocketConnectedMenuComponent } from './components/socket-connected-menu/socket-connected-menu.component';
import { DebugModeMenuComponent } from './components/debug-mode-menu/debug-mode-menu.component';
import { DebugModePanelComponent } from './components/debug-mode-panel/debug-mode-panel.component';
import { AiSocketService } from './services/ai-socket.service';

@Component({
  selector: 'app-ai-socket-menu',
  standalone: true,
  imports: [
    SocketDomainInputComponent,
    SocketConnectedMenuComponent,
    DebugModeMenuComponent,
    DebugModePanelComponent,
  ],
  template: `
    <div class="w-64 h-56 overflow-y-auto p-5 bg-lightGray font-mono text-sm">
      <app-debug-mode-menu (debugModeEmitter)="isDebugModeActive = $event" />
      @if (isDebugModeActive) {
        <app-debug-mode-panel
          [expectedInput]="expectedDataToReceive"
          (inputEmitter)="emitDebugSocketInput($event)" />
      } @else {
        <div class="flex flex-col w-full">
          <app-socket-domain-input
            class="mb-2"
            (socketDomainEmitter)="socketUrl = $event"
            [recentPhrases]="recentPhrases" />
          <span class="text-mainCreme w-full text-start">{{
            aiSocketService.getIsSocketConnected()
              ? 'Connected'
              : 'Disconnected'
          }}</span>
          <div class="mt-2">
            @if (aiSocketService.getIsSocketConnected()) {
              <button
                (click)="aiSocketService.getSocket()?.close()"
                class="mt-2 border-b-[1px] border-mainOrange w-full text-center font-black">
                Disconnect
              </button>
              @if (gameDataSendingType === tGameDataSendingType.TimeGame) {
                <app-socket-connected-menu
                  [isDataSendingActive]="
                    aiSocketService.getIsDataSendingActive()
                  "
                  [vSendingInterval]="vSendingInterval"
                  [socket]="aiSocketService.getSocket()"
                  [startDataExchange]="onStartDataExchangeClick"
                  [stopDataExchange]="
                    aiSocketService.stopDataExchange
                  "></app-socket-connected-menu>
              }
            } @else {
              <button
                (click)="onConnectButtonClick()"
                class="mt-2 border-b-[1px] border-mainOrange w-full text-center font-black">
                Connect
              </button>
            }
          </div>
        </div>
      }
    </div>
  `,
})
export class AiSocketMenuComponent implements OnInit, ILoggableDataComponent {
  @Input({ required: true }) public gameName = '';
  @Input({ required: true }) public gameDataSendingType: TGameDataSendingType =
    TGameDataSendingType.TimeGame;
  @Input({ required: true }) public expectedDataToReceive: TExchangeData = {};
  @Input({ required: true }) public set setDataToSend(value: TExchangeData) {
    this._dataToSend = value;
    if (this.gameDataSendingType === TGameDataSendingType.EventGame) {
      this.aiSocketService.sendDataToSocket(
        this._dataToSend,
        this.expectedDataToReceive
      );
    }
  }

  @Output() public logDataEmitter = new EventEmitter<TExchangeData>();
  @Output() public receivedDataEmitter = new EventEmitter<TExchangeData>();

  private _dataToSend: TExchangeData = {};

  public isDebugModeActive = false;
  public recentPhrases: string[] = [];
  public vSendingInterval = { value: 500 };
  public socketUrl = '';
  public tGameDataSendingType = TGameDataSendingType;
  public logData: TExchangeData = {
    isSocketConnected: this.aiSocketService.getIsSocketConnected(),
    socketURL: this.socketUrl,
    sendingInterval: this.vSendingInterval.value,
  };

  public constructor(public aiSocketService: AiSocketService) {
    console.log('AiSocketMenuComponent constructor');
  }

  public ngOnInit(): void {
    this.logDataEmitter.emit(this.logData);
    this.loadRecentPhrases();
  }

  public onStartDataExchangeClick = (): void => {
    this.aiSocketService.startDataExchange(
      this.vSendingInterval.value,
      this._dataToSend,
      this.expectedDataToReceive
    );
    this.emitLogData();
  };

  public onConnectButtonClick(): void {
    this.aiSocketService.connect(
      this.socketUrl,
      () => {
        this.saveRecentPhrase(this.socketUrl);
        this.emitLogData();
      },
      (event: MessageEvent<string>) => {
        this.receivedDataEmitter.emit(JSON.parse(event.data));
      },
      () => {
        this.emitLogData();
      }
    );
  }

  public emitDebugSocketInput(data: TExchangeData): void {
    this.receivedDataEmitter.emit(data);
  }

  //

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
    this.logData['socketURL'] = this.aiSocketService.getSocket()?.url || '';
    this.logData['isSocketConnected'] =
      this.aiSocketService.getIsSocketConnected();
    this.logData['sendingInterval'] = this.vSendingInterval;
    this.logDataEmitter.emit(this.logData);
  }
}
