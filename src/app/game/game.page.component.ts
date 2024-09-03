import { Component, OnDestroy, OnInit, inject } from '@angular/core';
import { Game } from './models/game.class';
import { ConsoleComponent } from './components/console/console.component';
import { TExchangeData } from './models/exchange-data.type';
import { DataMenuComponent } from './components/data-menu/data-menu.component';
import { AiSocketMenuComponent } from './components/ai-socket-menu/ai-socket-menu.component';
import { PongGameWindowComponent } from './games/pong/pong.component';
import { AuthRequiredDirective } from '@utils/directives/auth-required.directive';
import { TictactoeGameWindowComponent } from './games/tictactoe/tictactoe.component';
import { Subject, Subscription } from 'rxjs';
import { Player } from './models/player.class';
import { PlayerMenuComponent } from './components/player-menu/player-menu.component';
import { PlayerSourceType } from './models/player-source-type.enum';
import { games } from './data/games';
import { ActivatedRoute, Router, NavigationStart } from '@angular/router';
import { GameMenuComponent } from './components/game-menu/game-menu.component';

@Component({
  selector: 'app-game',
  standalone: true,
  imports: [
    PlayerMenuComponent,
    DataMenuComponent,
    AiSocketMenuComponent,
    PongGameWindowComponent,
    TictactoeGameWindowComponent,
    ConsoleComponent,
    AuthRequiredDirective,
    GameMenuComponent,
  ],
  template: `
    <div class="flex flex-col min-h-all w-full items-center bg-gray-400">
      @if (game) {
        <div *appAuthRequired class="absolute top-20 left-0 flex flex-col">
          <app-player-menu
            [players]="players"
            (playerSourceChangeEmitter)="updatePlayers($event)" />
          @if (filterPlayersByActiveAndSocket(playersSelected).length > 0) {
            <app-ai-socket-menu
              [dataToSend]="gameStateData"
              [gameName]="game.name"
              [players]="playersSelected"
              (receivedDataEmitter)="receiveSocketInputData($event)"
              [gamePause]="gamePauseSubject.asObservable()"
              [gameRestart]="gameRestartSubject.asObservable()" />
          }
        </div>
        <div *appAuthRequired class="absolute top-20 right-0 flex flex-col">
          <app-data-menu
            [gameName]="game.name"
            [setDataPossibleToPersist]="gameStateData" />
          <app-game-menu
            (pauseEmitter)="gamePauseSubject.next($event)"
            (restartEmitter)="gameRestartSubject.next()" />
        </div>
        <div class="flex w-full items-center justify-center py-12">
          @switch (game.name) {
            @case ('pong') {
              <app-pong
                class="flex flex-col items-center w-3/4"
                [setSocketInputDataReceive]="socketInputData"
                (gameStateDataEmitter)="receiveGameOutputData($event)"
                [abstractGame]="game"
                [gameRestart]="gameRestartSubject.asObservable()"
                [gamePause]="gamePauseSubject.asObservable()" />
            }
            @case ('tictactoe') {
              <app-tictactoe
                [setSocketInputDataReceive]="socketInputData"
                (gameStateDataEmitter)="receiveGameOutputData($event)"
                [abstractGame]="game"
                [gameRestart]="gameRestartSubject.asObservable()"
                [gamePause]="gamePauseSubject.asObservable()" />
            }
          }
        </div>
      }
    </div>
    <app-console [logData]="logData" />
  `,
})
export class GamePageComponent implements OnInit, OnDestroy {
  private _route = inject(ActivatedRoute);
  private _router = inject(Router);
  private _routerSubscription: Subscription | null = null;
  private _previousUrl = '';

  public gameName = '';
  public game: Game | null = null;
  public logData: Record<string, TExchangeData> = {};
  public players: Player[] = [];
  public playersSelected: Player[] = [];
  public socketInputData: TExchangeData = {};
  public gameStateData: TExchangeData = {};
  public gameRestartSubject = new Subject<void>();
  public gamePauseSubject = new Subject<boolean>();

  public ngOnInit(): void {
    this._route.paramMap.subscribe(params => {
      this.gameName = params.get('gameName') || '';
      this.loadGame();
    });

    this.handleRouterParams();
  }

  public receiveGameOutputData(data: TExchangeData): void {
    this.gameStateData = JSON.parse(
      JSON.stringify((data as TExchangeData)['output'])
    );
    this.logData['game window'] = data;
  }

  public receiveSocketInputData(data: TExchangeData): void {
    this.socketInputData = JSON.parse(JSON.stringify(data));
  }

  public ngOnDestroy(): void {
    if (this._routerSubscription) {
      this._routerSubscription.unsubscribe();
    }
  }

  public updatePlayers(players: Player[]): void {
    this.players = players;
    this.playersSelected = this.filterPlayersByActiveAndSocket(players);
  }

  public filterPlayersByActiveAndSocket(players: Player[]): Player[] {
    return players.filter(
      player =>
        player.active && player.getPlayerType === PlayerSourceType.SOCKET
    );
  }

  //

  private loadGame(): void {
    const game = games[this.gameName];
    if (!game) {
      this._router.navigate(['']);
    } else {
      this.game = game;
      this.players = game.players;
      this.playersSelected = game.players;
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
