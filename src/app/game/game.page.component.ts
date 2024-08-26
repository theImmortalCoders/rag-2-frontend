/* eslint-disable max-lines */
import { Component, OnDestroy, OnInit, inject } from '@angular/core';
import { ActivatedRoute, NavigationStart, Router } from '@angular/router';
import { NgComponentOutlet } from '@angular/common';
import { Game } from './models/game.class';
import { games } from './data-access/games';
import { ConsoleComponent } from './components/console/console.component';
import { TExchangeData } from './models/exchange-data.type';
import { DataMenuComponent } from './components/data-menu/data-menu.component';
import { AiSocketMenuComponent } from './components/ai-socket-menu/ai-socket-menu.component';
import { PongGameWindowComponent } from './components/games/pong/pong.component';
import { AuthRequiredDirective } from '@utils/directives/auth-required.directive';
import { TictactoeGameWindowComponent } from './components/games/tictactoe/tictactoe.component';
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
          (playerSourceChangeEmitter)="updatePlayers($event)"></app-player-menu>
        <div *appAuthRequired class="absolute top-20 right-0 flex flex-col">
          <button
            (click)="toggleDataMenu()"
            class="side-menu-button top-0 w-12 h-44 {{
              isDataMenuVisible ? 'right-64' : 'right-0'
            }}">
            <span
              class="[writing-mode:vertical-rl] [text-orientation:upright] tracking-[0.45em]"
              >DATA</span
            >
          </button>
          <app-data-menu
            class="side-menu-container top-0 {{
              isDataMenuVisible ? 'right-0' : '-right-64'
            }}"
            (logDataEmitter)="logData['data menu'] = $event"
            [gameName]="game.getName()"
            [setDataPossibleToPersist]="gameWindowOutputData"></app-data-menu>
          @if (playersSelected.length > 0) {
            <button
              (click)="toggleAISocketMenu()"
              class="side-menu-button top-52 w-12 h-56 {{
                isAISocketMenuVisible ? 'right-64' : 'right-0'
              }}">
              <span
                class="[writing-mode:vertical-rl] [text-orientation:upright] tracking-[0.325em]"
                >AI&nbsp;SOCKET</span
              >
            </button>
            <app-ai-socket-menu
              class="side-menu-container top-52 {{
                isAISocketMenuVisible ? 'right-0' : '-right-64'
              }}"
              [dataToSend]="gameWindowOutputData"
              [gameName]="game.getName()"
              [players]="playersSelected"
              (receivedDataEmitter)="
                receiveSocketInputData($event)
              "></app-ai-socket-menu>
          }
        </div>
        @switch (game.getName()) {
          @case ('pong') {
            <app-pong
              [setSocketInputDataReceive]="socketInputData"
              (gameWindowOutputDataEmitter)="receiveGameOutputData($event)"
              [players]="playersSelected"></app-pong>
          }
          @case ('tictactoe') {
            <app-tictactoe
              [setSocketInputDataReceive]="socketInputData"
              (gameWindowOutputDataEmitter)="receiveGameOutputData($event)"
              [players]="playersSelected"></app-tictactoe>
          }
        }
      }
      <div class="sticky bottom-0 left-0 w-full z-50">
        <button
          class="w-full bg-lightGray tracking-[0.15em] sticky z-50 top-0 transition-all ease-in-out duration-700 border-b-2 border-mainOrange hover:border-green-500 text-center py-2 uppercase font-bold font-mono text-xl cursor-pointer"
          (click)="toggleConsole()">
          console
        </button>
        <div
          class="w-full max-h-96 transition-all ease-in-out duration-700 {{
            isConsoleVisible ? 'h-72' : 'h-0'
          }} bg-lightGray overflow-y-scroll z-50">
          <app-console
            [logData]="logData"
            class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 items-start gap-y-6 transition-all ease-in-out duration-700 {{
              isConsoleVisible ? 'p-10' : 'p-0'
            }}" />
        </div>
      </div>
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

  public isConsoleVisible = false;
  public isDataMenuVisible = false;
  public isAISocketMenuVisible = false;

  public toggleConsole(): void {
    this.isConsoleVisible = !this.isConsoleVisible;
  }

  public toggleDataMenu(): void {
    this.isDataMenuVisible = !this.isDataMenuVisible;
  }

  public toggleAISocketMenu(): void {
    this.isAISocketMenuVisible = !this.isAISocketMenuVisible;
  }

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
          this.isConsoleVisible = false;
          this.isDataMenuVisible = false;
          this.isAISocketMenuVisible = false;
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
