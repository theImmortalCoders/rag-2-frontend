import { Component, OnInit, inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NgComponentOutlet } from '@angular/common';
import { Game } from './models/game.class';
import { games } from './data-access/games';
import { ConsoleComponent } from './components/console/console.component';
import { TGameDataSendingType } from './models/game-data-sending-type.enum';
import { TExchangeData } from './models/exchange-data.type';
import { DataMenuComponent } from './components/data-menu/data-menu.component';
import { AiSocketMenuComponent } from './components/ai-socket-menu/ai-socket-menu.component';
import { PongGameWindowComponent } from './components/games/pong/pong.component';
import { AuthRequiredDirective } from '../../utils/directives/auth-required.directive';
import { TictactoeGameWindowComponent } from './components/games/tictactoe/tictactoe.component';
import { ExchangeDataPipe } from '../../utils/pipes/exchange-data.pipe';

@Component({
  selector: 'app-game',
  standalone: true,
  template: `
    <div class="min-h-screen w-full flex flex-col justify-between">
      @if (game) {
        <div *appAuthRequired class="absolute top-20 right-0 flex flex-col">
          <app-data-menu
            (logDataEmitter)="logData['data menu'] = $event"
            [gameName]="game.getName()"
            [setDataPossibleToPersist]="gameWindowOutputData"></app-data-menu>
          <app-ai-socket-menu
            class=" border-2 border-solid border-red-600 p-5"
            [setDataToSend]="gameWindowOutputData"
            [expectedDataToReceive]="
              logData['game window']['input'] | exchange_data
            "
            [gameDataSendingType]="game.getGameDataSendingType()"
            [gameName]="game.getName()"
            (receivedDataEmitter)="receiveSocketInputData($event)"
            (logDataEmitter)="
              logData['ai-socket menu'] = $event
            "></app-ai-socket-menu>
        </div>
        @switch (game.getName()) {
          @case ('pong') {
            <app-pong
              [setSocketInputDataReceive]="socketInputData"
              (gameWindowOutputDataEmitter)="
                receiveGameOutputData($event)
              "></app-pong>
          }
          @case ('tictactoe') {
            <app-tictactoe
              [setSocketInputDataReceive]="socketInputData"
              (gameWindowOutputDataEmitter)="
                receiveGameOutputData($event)
              "></app-tictactoe>
          }
        }
      }
      <div class="fixed bottom-0 left-0 w-full z-50">
        <button
          class="w-full bg-lightGray sticky z-50 top-0 border-b-2 border-mainOrange text-center py-2 uppercase font-bold font-mono text-xl cursor-pointer"
          (click)="toggleConsole()">
          {{ isConsoleVisible ? 'hide' : 'show' }} console
        </button>
        <div
          class="w-full max-h-96 transition-all ease-in-out duration-700 {{
            isConsoleVisible ? 'h-72' : 'h-0'
          }} bg-lightGray overflow-y-auto z-50">
          <app-console
            [logData]="logData"
            class="flex flex-row justify-around transition-all ease-in-out duration-700 {{
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
  ],
})
export class GamePageComponent implements OnInit {
  private _route = inject(ActivatedRoute);
  private _router = inject(Router);

  public gameName = '';
  public game: Game | null = null;
  public logData: Record<string, TExchangeData> = {};

  public socketInputData: TExchangeData = {};
  public gameWindowOutputData: TExchangeData = {};

  public isConsoleVisible = false;

  public toggleConsole(): void {
    this.isConsoleVisible = !this.isConsoleVisible;
  }

  public ngOnInit(): void {
    this._route.paramMap.subscribe(params => {
      this.gameName = params.get('gameName') || '';
      this.loadGame();
    });

    this.updateGameLogData();
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

  //

  private loadGame(): void {
    const game = games[this.gameName];
    if (!game) {
      this._router.navigate(['']);
    } else {
      this.game = game;
    }
  }

  private updateGameLogData(): void {
    if (!this.game) return;

    this.logData['game'] = {
      game: this.game.getName(),
      dataSendingType: TGameDataSendingType[this.game.getGameDataSendingType()],
    };
  }
}
