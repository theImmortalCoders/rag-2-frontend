import { Component, OnDestroy, OnInit, inject } from '@angular/core';
import { Game } from '@gameModels/game.class';
import { ConsoleComponent } from './components/console/console.component';
import { TExchangeData } from '@gameModels/exchange-data.type';
import { DataMenuComponent } from './components/data-menu/data-menu.component';
import { AiSocketMenuComponent } from './components/ai-socket-menu/ai-socket-menu.component';
import { PongGameWindowComponent } from './games/pong/pong.component';
import { AuthRequiredDirective } from '@utils/directives/auth-required.directive';
import { Subject, Subscription } from 'rxjs';
import { Player } from '@gameModels/player.class';
import { PlayerMenuComponent } from './components/player-menu/player-menu.component';
import { PlayerSourceType } from 'app/shared/models/player-source-type.enum';
import { games } from './data/games';
import { ActivatedRoute, Router, NavigationStart } from '@angular/router';
import { GameMenuComponent } from './components/game-menu/game-menu.component';
import { BreakpointObserver, BreakpointState } from '@angular/cdk/layout';
import { CantDisplayGameComponent } from './components/cant-display-game/cant-display-game.component';
import { SkiJumpGameWindowComponent } from './games/ski-jump/ski-jump.component';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-game',
  standalone: true,
  imports: [
    PlayerMenuComponent,
    DataMenuComponent,
    AiSocketMenuComponent,
    PongGameWindowComponent,
    ConsoleComponent,
    AuthRequiredDirective,
    GameMenuComponent,
    CantDisplayGameComponent,
    AuthRequiredDirective,
    SkiJumpGameWindowComponent,
    CommonModule,
  ],
  template: `
    <div class="flex flex-col min-h-all w-full items-center bg-gray-400">
      @if (isMinWidthXl) {
        @if (game) {
          <div>
            <div class="absolute z-10 top-20 left-0 flex flex-col">
              <app-player-menu
                *appAuthRequired
                [players]="game.players"
                (playerSourceChangeEmitter)="updatePlayers($event)" />
              @if (filterPlayersByActiveAndSocket(game.players).length > 0) {
                <app-ai-socket-menu
                  *appAuthRequired
                  [dataToSend]="gameData"
                  [gameName]="game.name"
                  [players]="filterPlayersByActiveAndSocket(game.players)"
                  (receivedDataEmitter)="receiveSocketInputData($event)"
                  [gamePause]="gamePauseSubject.asObservable()"
                  [gameRestart]="gameRestartSubject.asObservable()" />
              }
            </div>
            <div class="absolute top-20 right-0 flex flex-col">
              <app-game-menu
                (pauseEmitter)="gamePauseSubject.next($event)"
                (restartEmitter)="gameRestartSubject.next()" />
              <app-data-menu
                *appAuthRequired
                [game]="game"
                [gamePause]="gamePauseSubject.asObservable()"
                [setDataPossibleToPersist]="gameStateData" />
            </div>
          </div>
          <div class="group font-mono absolute left-0 top-0 z-30">
            <div
              class="absolute z-30 top-4 left-4 rounded-full bg-gray-400 group-hover:bg-mainCreme border-2 border-mainGray transition-all ease-in-out duration-300">
              <i
                data-feather="info"
                class="size-9 text-mainGray group-hover:scale-110 transition-all ease-in-out duration-300"></i>
            </div>
            <div
              class="flex absolute z-20 top-4 left-4 h-10 w-56 pointer-events-none opacity-0 group-hover:opacity-100 items-start justify-center rounded-l-full rounded-tr-full bg-mainGray text-mainCreme text-nowrap transition-all ease-in-out duration-300">
              <p class="text-center py-2 pl-12 pr-4 uppercase">
                Game controls:
              </p>
            </div>
            <div
              class="flex flex-col w-[184px] absolute z-10 top-14 left-14 pl-3 pb-4 shadow-controlPanelShadow pointer-events-none opacity-0 group-hover:opacity-100 bg-mainGray text-mainCreme transition-all ease-in-out duration-300">
              @for (player of game.players; track player) {
                <span class="text-bold text-sm uppercase text-mainOrange"
                  >Player {{ $index + 1 }}</span
                >
                @for (
                  control of player.controlsDescription | keyvalue;
                  track control
                ) {
                  <span class="text-xs pl-2"
                    >{{ control.key }}: {{ control.value }}</span
                  >
                }
              }
            </div>
          </div>
          <div class="flex w-full items-center justify-center py-12">
            @switch (game.name) {
              @case ('pong') {
                <app-pong
                  class="flex flex-col items-center w-3/4"
                  [setSocketInputDataReceive]="socketInputData"
                  (gameStateDataEmitter)="receiveGameOutputData($event)"
                  [setAbstractGame]="game"
                  [gameRestart]="gameRestartSubject.asObservable()"
                  [gamePause]="gamePauseSubject.asObservable()" />
              }
              @case ('skijump') {
                <app-ski-jump
                  class="flex flex-col items-center w-3/4"
                  [setSocketInputDataReceive]="socketInputData"
                  (gameStateDataEmitter)="receiveGameOutputData($event)"
                  [setAbstractGame]="game"
                  [gameRestart]="gameRestartSubject.asObservable()"
                  [gamePause]="gamePauseSubject.asObservable()" />
              }
            }
          </div>
        }
        <app-console [logData]="logData" />
      } @else {
        <app-cant-display-game />
      }
    </div>
  `,
})
export class GamePageComponent implements OnInit, OnDestroy {
  private _route = inject(ActivatedRoute);
  private _router = inject(Router);
  private _routerSubscription = new Subscription();
  private _breakpointSubscription = new Subscription();
  private _previousUrl = '';

  public gameName = '';
  public game!: Game;
  public logData: Record<string, TExchangeData> = {};
  public socketInputData: TExchangeData = {};
  public gameData!: Game;
  public gameStateData: TExchangeData = {};
  public gameRestartSubject = new Subject<void>();
  public gamePauseSubject = new Subject<boolean>();
  public isMinWidthXl = false;

  public constructor(private _breakpointObserver: BreakpointObserver) {
    this._breakpointSubscription = this._breakpointObserver
      .observe(['(min-width: 1280px)'])
      .subscribe((state: BreakpointState) => {
        this.isMinWidthXl = state.matches;
      });
  }

  public ngOnInit(): void {
    this._route.paramMap.subscribe(params => {
      this.gameName = params.get('gameName') || '';
      this.loadGame();
    });

    this.handleRouterParams();
  }

  public receiveGameOutputData(data: Game): void {
    this.gameData = JSON.parse(JSON.stringify(data));
    this.gameStateData = JSON.parse(
      JSON.stringify(this.gameData.state as TExchangeData)
    );
    this.logData['game window'] = this.gameStateData;
  }

  public receiveSocketInputData(data: TExchangeData): void {
    this.socketInputData = JSON.parse(JSON.stringify(data));
  }

  public ngOnDestroy(): void {
    this._routerSubscription.unsubscribe();
    this._breakpointSubscription.unsubscribe();
  }

  public updatePlayers(players: Player[]): void {
    this.game.players = players;
  }

  public filterPlayersByActiveAndSocket(players: Player[]): Player[] {
    return players.filter(
      player => player.isActive && player.playerType === PlayerSourceType.SOCKET
    );
  }

  //

  private loadGame(): void {
    const game = games[this.gameName];
    if (!game) {
      this._router.navigate(['']);
    } else {
      this.game = game;
    }
  }

  private handleRouterParams(): void {
    this._routerSubscription = this._router.events.subscribe(event => {
      if (event instanceof NavigationStart) {
        const currentUrl = event.url.split('?')[0]; // Get the path part of the URL
        if (this._previousUrl !== currentUrl) {
          this._previousUrl = currentUrl;
        }
      }
    });
  }
}
