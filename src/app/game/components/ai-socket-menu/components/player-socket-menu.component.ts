import {
  Component,
  EventEmitter,
  Input,
  Output,
  OnInit,
  inject,
} from '@angular/core';
import { TExchangeData } from 'app/game/models/exchange-data.type';
import { PlayerSourceType } from 'app/game/models/player-source-type.enum';
import { AiSocketService } from '../services/ai-socket.service';
import { Player } from 'app/game/models/player.class';
import { DebugModeMenuComponent } from './components/debug-mode-menu/debug-mode-menu.component';
import { DebugModePanelComponent } from './components/debug-mode-panel/debug-mode-panel.component';
import { SocketDomainInputComponent } from './components/socket-domain-input/socket-domain-input.component';
import { SocketConnectedMenuComponent } from './components/socket-connected-menu/socket-connected-menu.component';

@Component({
  selector: 'app-player-socket-menu',
  standalone: true,
  imports: [
    DebugModeMenuComponent,
    DebugModePanelComponent,
    SocketDomainInputComponent,
    SocketConnectedMenuComponent,
  ],
  providers: [AiSocketService],
  template: `
    {{ player.name }}
    <app-debug-mode-menu (debugModeEmitter)="isDebugModeActive = $event" />
    @if (isDebugModeActive) {
      <app-debug-mode-panel
        [expectedInput]="player.inputData"
        (inputEmitter)="emitSocketInput($event)" />
    } @else {
      <div class="flex flex-col w-full">
        <app-socket-domain-input
          class="mb-2"
          (socketDomainEmitter)="socketUrl = $event"
          [recentPhrases]="recentPhrases" />
        <span class="text-mainCreme w-full text-start">{{
          aiSocketService.getIsSocketConnected() ? 'Connected' : 'Disconnected'
        }}</span>
        <div class="mt-2">
          @if (aiSocketService.getIsSocketConnected()) {
            <button
              (click)="aiSocketService.getSocket()?.close()"
              class="mt-2 border-b-[1px] border-mainOrange w-full text-center font-black">
              Disconnect
            </button>

            <app-socket-connected-menu
              [isDataSendingActive]="aiSocketService.getIsDataSendingActive()"
              [vSendingInterval]="vSendingInterval"
              [socket]="aiSocketService.getSocket()"
              [startDataExchange]="onStartDataExchangeClick"
              [stopDataExchange]="
                aiSocketService.stopDataExchange
              "></app-socket-connected-menu>
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
  `,
})
export class PlayerSocketMenuComponent implements OnInit {
  @Input({ required: true }) public player!: Player;
  @Input({ required: true }) public gameName = '';
  public recentPhrases: string[] = [];
  @Input({ required: true }) public dataToSend: TExchangeData = {};

  @Output() public receivedDataEmitter = new EventEmitter<TExchangeData>();

  public isDebugModeActive = false;
  public vSendingInterval = { value: 500 };
  public socketUrl = '';
  public playerSourceType = PlayerSourceType;
  public aiSocketService = inject(AiSocketService);

  public ngOnInit(): void {
    this.loadRecentPhrases();
  }

  public onStartDataExchangeClick = (): void => {
    this.aiSocketService.startDataExchange(
      this.vSendingInterval.value,
      this.dataToSend,
      this.player.inputData,
      this.player.expectedDataDescription
    );
  };

  public onConnectButtonClick(): void {
    this.aiSocketService.connect(
      this.socketUrl,
      () => {
        this.saveRecentPhrase(this.socketUrl);
      },
      (event: MessageEvent<string>) => {
        this.emitSocketInput(JSON.parse(event.data));
      },
      () => {
        console.log('onConnectButtonClick');
      }
    );
  }

  public emitSocketInput(data: TExchangeData): void {
    this.receivedDataEmitter.emit({ player: this.player, data: data });
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
}
