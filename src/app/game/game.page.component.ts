import { Component, OnDestroy, OnInit, inject } from '@angular/core';
import { ActivatedRoute, NavigationStart, Router } from '@angular/router';
import { NgComponentOutlet } from '@angular/common';
import { Game } from './models/game.class';
import { games } from './data-access/games';
import { ConsoleComponent } from './components/console/console.component';
import { TExchangeData } from './models/exchange-data.type';
import { DataMenuComponent } from './components/data-menu/data-menu.component';
import { AiSocketMenuComponent } from './components/ai-socket-menu/ai-socket-menu.component';
import { PongGameWindowComponent } from './games/pong/pong.component';
import { AuthRequiredDirective } from '@utils/directives/auth-required.directive';
import { TictactoeGameWindowComponent } from './games/tictactoe/tictactoe.component';
import { ExchangeDataPipe } from '@utils/pipes/exchange-data.pipe';
import { Subscription } from 'rxjs';
import { Player } from './models/player.class';
import { PlayerMenuComponent } from './components/player-menu/player-menu.component';
import { PlayerSourceType } from './models/player-source-type.enum';

@Component({
  selector: 'app-game',
  standalone: true,
  template: `
    <div class="min-h-all w-full flex flex-col justify-between">
      @if (game) {
        <app-player-menu
          class="absolute top-52 left-0"
          [players]="players"
          (playerSourceChangeEmitter)="updatePlayers($event)" />
        <div *appAuthRequired class="absolute top-20 right-0 flex flex-col">
          <app-data-menu
            [gameName]="game.getName()"
            [setDataPossibleToPersist]="gameWindowOutputData" />
          @if (getSocketPlayers().length > 0) {
            <app-ai-socket-menu
              [dataToSend]="gameWindowOutputData"
              [gameName]="game.getName()"
              [players]="playersSelected"
              (receivedDataEmitter)="receiveSocketInputData($event)" />
          }
        </div>
        @switch (game.getName()) {
          @case ('pong') {
            <app-pong
              [setSocketInputDataReceive]="socketInputData"
              (gameWindowOutputDataEmitter)="receiveGameOutputData($event)"
              [players]="players" />
          }
          @case ('tictactoe') {
            <app-tictactoe
              [setSocketInputDataReceive]="socketInputData"
              (gameWindowOutputDataEmitter)="receiveGameOutputData($event)"
              [players]="players" />
          }
        }
      }
      <app-console [logData]="logData" />
    </div>
  `,
  imports: [
    NgComponentOutlet,
    ConsoleComponent,
    DataMenuComponent,
    AuthRequiredDirective,
    AiSocketMenuComponent,
    PongGameWindowComponent,
    TictactoeGameWindowComponent,
    ExchangeDataPipe,
    PlayerMenuComponent,
  ],
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
  public gameWindowOutputData: TExchangeData = {};

  public ngOnInit(): void {
    this._route.paramMap.subscribe(params => {
      this.gameName = params.get('gameName') || '';
      this.loadGame();
    });

    this.updateGameLogData();

    this._routerSubscription = this._router.events.subscribe(event => {
      if (event instanceof NavigationStart) {
        const currentUrl = event.url.split('?')[0]; // Get the path part of the URL
        if (this._previousUrl !== currentUrl) {
          this._previousUrl = currentUrl; // Update the previous URL
        }
      }
    });
  }

  public receivePlayerMenuOutputData(data: TExchangeData): void {
    this.logData['player menu'] = data;
  }

  public receiveGameOutputData(data: TExchangeData): void {
    this.gameWindowOutputData = JSON.parse(
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
    this.playersSelected = players.filter(
      player =>
        player.active && player.getPlayerType === PlayerSourceType.SOCKET
    );
  }

  public getSocketPlayers(): Player[] {
    return this.playersSelected.filter(
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
      this.players = game.getPlayers();
      this.playersSelected = game.getPlayers();
    }
  }

  private updateGameLogData(): void {
    if (!this.game) return;

    this.logData['game'] = {
      game: this.game.getName(),
    };
  }
}
