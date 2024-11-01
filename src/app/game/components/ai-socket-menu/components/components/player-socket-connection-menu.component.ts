import {
  AfterViewInit,
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
import { SocketDomainInputComponent } from './components/socket-domain-input/socket-domain-input.component';
import { SocketConnectedMenuComponent } from './components/socket-connected-menu/socket-connected-menu.component';
import { Observable, Subscription } from 'rxjs';
import { PageVisibilityService } from 'app/shared/services/page-visibility.service';
import { UrlParamService } from 'app/shared/services/url-param.service';

@Component({
  selector: 'app-player-socket-connection-menu',
  standalone: true,
  imports: [SocketDomainInputComponent, SocketConnectedMenuComponent],
  providers: [AiSocketService],
  template: `
    <div class="flex flex-col w-full">
      <app-socket-domain-input
        class="mb-2"
        [initialValue]="socketUrl"
        [gameName]="gameName"
        (socketDomainEmitter)="socketUrl = $event"
        (recentPhrasesEmitter)="recentPhrases = $event" />
      <span class="text-mainCreme w-full text-start mb-2">{{
        aiSocketService.getIsSocketConnected() ? 'Connected' : 'Disconnected'
      }}</span>
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
      }
    </div>
  `,
})
export class PlayerSocketConnectionMenuComponent implements OnInit, OnDestroy {
  @Input({ required: true }) public gameName = '';
  @Input({ required: true }) public set setDataToSend(data: TExchangeData) {
    this.dataToSend = data;
    this.aiSocketService.setDataToSend(data);
  }
  @Input({ required: true }) public player!: Player;
  @Input({ required: true }) public gamePause = new Observable<boolean>();
  @Input({ required: true }) public gameRestart = new Observable<void>();

  @Output() public receivedDataEmitter = new EventEmitter<TExchangeData>();

  private _pageVisibilityService = inject(PageVisibilityService);
  private _urlParamService = inject(UrlParamService);
  private _pauseSubscription = new Subscription();
  private _restartSubscription = new Subscription();
  private _pageVisibilitySubscription = new Subscription();

  public dataToSend: TExchangeData = {};
  public socketUrl = '';
  public aiSocketService = inject(AiSocketService);
  public recentPhrases: string[] = [];
  public playerSourceType = PlayerSourceType;
  public vSendingInterval = { value: 100 };
  public isPaused = false;

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
    this._pauseSubscription.unsubscribe();
    this._restartSubscription.unsubscribe();
    this._pageVisibilitySubscription.unsubscribe();
  }

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

    this._urlParamService.setQueryParam(
      'player-' + this.player.id + '-socketUrl',
      this.socketUrl
    );
  }

  public onStartDataExchangeClick = (): void => {
    this.aiSocketService.startDataExchange(
      this.vSendingInterval.value,
      this.player.inputData,
      this.player.id
    );
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
