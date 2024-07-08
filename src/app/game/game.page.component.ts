import { Component, OnInit, inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NgComponentOutlet } from '@angular/common';
import { Game } from './models/game.class';
import { games } from './data-access/games';
import { ConsoleComponent } from './components/console/console.component';
import { TGameDataSendingType } from './models/game-data-sending-type.enum';
import { TExchangeData } from './models/exchange-data.type';
import { DataMenuComponent } from './components/data-menu/data-menu.component';
import { TRole } from '../shared/models/role.enum';
import { AuthRequiredDirective } from '../shared/directives/auth-required.directive';
import { AiSocketMenuComponent } from './components/ai-socket-menu/ai-socket-menu.component';
import { RecordPipe } from '../shared/pipes/record.pipe';
import { PongGameWindowComponent } from './components/games/pong/pong.component';
import { TetrisGameWindowComponent } from './components/games/tetris/tetris.component';

@Component({
  selector: 'app-game',
  standalone: true,
  template: `
    <div class="min-h-screen w-full">
      @if (game) {
        <div class="absolute top-20 right-0 flex flex-col">
          <app-data-menu
            *appAuthRequired
            (logDataEmitter)="logData['data menu'] = $event"
            [gameName]="game.getName()"
            [dataPossibleToPersist]="
              logData['game window']['output'] | record
            "></app-data-menu>
          <app-ai-socket-menu
            *appAuthRequired
            [dataToSend]="logData['game window']['output'] | record"
            (receivedDataEmitter)="gameWindowReceivedData = $event"
            (logDataEmitter)="
              logData['ai-socket menu'] = $event
            "></app-ai-socket-menu>
        </div>
        @switch (game.getName()) {
          @case ('pong') {
            <app-pong
              [gameWindowInputData]="gameWindowReceivedData"
              (gameWindowOutputDataEmitter)="
                logData['game window'] = $event
              "></app-pong>
          }
          @case ('tetris') {
            <app-tetris
              (gameWindowOutputDataEmitter)="
                logData['game window'] = $event
              "></app-tetris>
          }
        }
      }
    </div>
    <div
      class="fixed bottom-0 p-10 bg-white border-y-red-600 border-solid border-2 left-0 w-full z-50">
      <app-console [logData]="logData"></app-console>
    </div>
  `,
  imports: [
    NgComponentOutlet,
    ConsoleComponent,
    DataMenuComponent,
    AuthRequiredDirective,
    AiSocketMenuComponent,
    RecordPipe,
    PongGameWindowComponent,
    TetrisGameWindowComponent,
  ],
})
export class GamePageComponent implements OnInit {
  private _route = inject(ActivatedRoute);
  private _router = inject(Router);

  public gameName = '';
  public game: Game | null = null;
  public logData: Record<string, TExchangeData> = {};
  public roleEnum = TRole;
  public gameWindowReceivedData: TExchangeData = {};

  public ngOnInit(): void {
    this._route.paramMap.subscribe(params => {
      this.gameName = params.get('gameName') || '';
      this.loadGame();
    });

    this.updateGameLogData();
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
