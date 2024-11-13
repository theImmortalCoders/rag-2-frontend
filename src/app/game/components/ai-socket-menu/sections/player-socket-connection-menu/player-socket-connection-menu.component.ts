/* eslint-disable max-lines */
import {
  Component,
  EventEmitter,
  inject,
  Input,
  OnDestroy,
  OnInit,
  Output,
} from '@angular/core';
import { AiSocketService } from '../../services/ai-socket.service';
import { TExchangeData } from '@gameModels/exchange-data.type';
import { PlayerSourceType } from 'app/shared/models/player-source-type.enum';
import { Player } from '@gameModels/player.class';
import { SocketDomainInputComponent } from '../socket-domain-input/socket-domain-input.component';
import { SocketConnectedMenuComponent } from '../socket-connected-menu/socket-connected-menu.component';
import { Observable, Subscription } from 'rxjs';
import { PageVisibilityService } from 'app/shared/services/page-visibility.service';
import { UrlParamService } from 'app/shared/services/url-param.service';
import { SocketListService } from '../../services/socket-list.service';
import { ModelSelectionComponent } from '../model-selection/model-selection.component';
import { Game } from '@gameModels/game.class';

@Component({
  selector: 'app-player-socket-connection-menu',
  standalone: true,
  imports: [
    SocketDomainInputComponent,
    SocketConnectedMenuComponent,
    ModelSelectionComponent,
  ],
  providers: [AiSocketService],
  template: `
    <div class="flex flex-col w-full">
      <app-model-selection
        class="mb-2"
        [isDisabled]="isConnected ? true : false"
        [gameName]="gameName"
        [currentSocketDomain]="socketUrl"
        (socketDomainEmitter)="socketUrl = $event" />
      <span class="text-mainCreme font-bold">Custom model address:</span>
      <app-socket-domain-input
        class="mb-2"
        [isDisabled]="isConnected ? true : false"
        [initialValue]="socketUrl"
        [gameName]="gameName"
        (socketDomainEmitter)="socketUrl = $event"
        (recentPhrasesEmitter)="recentPhrases = $event" />
      <span class="text-mainOrange font-bold">STATUS:</span>
      <span
        class="w-full text-start mb-2 {{
          aiSocketService.getIsSocketConnected()
            ? 'text-green-500'
            : 'text-red-500'
        }}"
        >{{
          aiSocketService.getIsSocketConnected() ? 'Connected' : 'Disconnected'
        }}</span
      >
      @if (aiSocketService.getIsSocketConnected()) {
        <app-socket-connected-menu
          [isDataSendingActive]="aiSocketService.getIsDataSendingActive()"
          [vSendingInterval]="vSendingInterval"
          [socket]="aiSocketService.getSocket()"
          [startDataExchange]="onStartDataExchangeClick"
          [stopDataExchange]="aiSocketService.stopDataExchange"
          [isPaused]="isPaused"
          [playerId]="player.id" />
      } @else {
        <button
          (click)="onConnectButtonClick()"
          class="mt-2 border-b-[1px] border-mainOrange w-full text-center font-black">
          Connect
        </button>
        @if (canNotConnect) {
          <span class="text-mainRed w-full text-start mt-2"
            >Cannot connect</span
          >
        }
      }
    </div>
  `,
})
export class PlayerSocketConnectionMenuComponent implements OnInit, OnDestroy {
  @Input({ required: true }) public gameName = '';
  @Input({ required: true }) public set setDataToSend(data: Game) {
    this.dataToSend = {
      name: data.name,
      outputSpec: data.outputSpec,
      players: data.players,
      state: data.state,
    } as TExchangeData;
    this.aiSocketService.setDataToSend(this.dataToSend);
  }
  @Input({ required: true }) public player!: Player;
  @Input({ required: true }) public gamePause = new Observable<boolean>();
  @Input({ required: true }) public gameRestart = new Observable<void>();

  @Output() public receivedDataEmitter = new EventEmitter<TExchangeData>();
  @Output() public connectedEmitter = new EventEmitter<boolean>();

  private _pageVisibilityService = inject(PageVisibilityService);
  private _urlParamService = inject(UrlParamService);
  private _socketListService = inject(SocketListService);

  private _pauseSubscription = new Subscription();
  private _restartSubscription = new Subscription();
  private _pageVisibilitySubscription = new Subscription();

  public isConnected = false;
  public dataToSend: TExchangeData = {};
  public socketUrl = '';
  public aiSocketService = inject(AiSocketService);
  public recentPhrases: string[] = [];
  public playerSourceType = PlayerSourceType;
  public vSendingInterval = { value: 100 };
  public isPaused = false;
  public canNotConnect = false;

  public ngOnInit(): void {
    this._restartSubscription = this.gameRestart.subscribe(() => {
      console.log('Restart - ai socket'); //can be used
    });
    this._pauseSubscription = this.gamePause.subscribe(value => {
      if (value) {
        this.isPaused = true;
        this.aiSocketService.pauseDataExchange();
      } else {
        this.isPaused = false;
        this.aiSocketService.resumeDataExchange(
          this.vSendingInterval.value,
          this.player.inputData,
          this.player.id
        );
      }
    });
    this._pageVisibilitySubscription = this._pageVisibilityService
      .getVisibilityState()
      .subscribe(isVisible => {
        if (!isVisible) {
          this.aiSocketService.pauseDataExchange();
        } else if (!this.isPaused) {
          this.aiSocketService.resumeDataExchange(
            this.vSendingInterval.value,
            this.player.inputData,
            this.player.id
          );
        }
      });

    this.syncPropsWithUrl();
  }
  public ngOnDestroy(): void {
    this.aiSocketService.stopDataExchange();
    this._pauseSubscription.unsubscribe();
    this._restartSubscription.unsubscribe();
    this._pageVisibilitySubscription.unsubscribe();
    this._socketListService.clearList();
    this.canNotConnect = false;
  }
  public onConnectButtonClick(): void {
    if (this._socketListService.getSocketList().includes(this.socketUrl)) {
      this.canNotConnect = true;
      return;
    }
    this.aiSocketService.connect(
      this.socketUrl,
      () => {
        this.saveRecentPhrase(this.socketUrl);
        this._socketListService.addToList(this.socketUrl);
        this.canNotConnect = false;
        this.isConnected = true;
        this.connectedEmitter.emit(true);
      },
      (event: MessageEvent<string>) => {
        this.emitSocketInput(JSON.parse(event.data));
      },
      () => {
        this._socketListService.removeFromList(this.socketUrl);
        this.canNotConnect = false;
        this.isConnected = false;
        this.connectedEmitter.emit(false);
      }
    );
    this._urlParamService.setQueryParam(
      'player-' + this.player.id + '-socketUrl',
      this.socketUrl
    );
  }
  public onStartDataExchangeClick = (): void => {
    if (this.vSendingInterval.value) {
      console.log('start', this.vSendingInterval.value);
      this.aiSocketService.startDataExchange(
        this.vSendingInterval.value,
        this.player.inputData,
        this.player.id
      );
    }
  };
  //
  private emitSocketInput(data: TExchangeData): void {
    this.receivedDataEmitter.emit({ player: this.player, data: data });
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
  private syncPropsWithUrl(): void {
    setTimeout(() => {
      const socketUrl = this._urlParamService.getQueryParam(
        'player-' + this.player.id + '-socketUrl'
      );

      if (socketUrl !== null) {
        this.socketUrl = socketUrl;
      } else {
        this._urlParamService.setQueryParam(
          'player-' + this.player.id + '-socketUrl',
          this.socketUrl
        );
      }
    });
  }
}
