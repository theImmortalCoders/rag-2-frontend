import {
  AfterViewInit,
  Component,
  OnInit,
  Type,
  ViewChild,
  inject,
} from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NgComponentOutlet } from '@angular/common';
import { Game } from './models/game.class';
import { GameMenuComponent } from './components/menu/game-menu.component';
import { games } from './data-access/games';
import { ConsoleComponent } from './components/console/console.component';
import { TGameDataSendingType } from './models/game-data-sending-type.enum';
import { TExchangeData } from './models/exchange-data.type';
import { DataMenuComponent } from './components/data-menu/data-menu.component';
import { TRole } from '../shared/models/role.enum';
import { AuthRequiredDirective } from '../shared/directives/auth-required.directive';
import { AiSocketMenuComponent } from './components/ai-socket-menu/ai-socket-menu.component';
import { RecordPipe } from '../shared/pipes/record.pipe';
import { IBaseGameWindowComponent } from './components/games/models/base-game-component';

@Component({
  selector: 'app-game',
  standalone: true,
  template: `
    <div class="min-h-screen w-full">
      @if (game) {
        <app-game-menu
          (logDataEmitter)="logData['menu'] = $event"
          [gameDataSendingType]="game.getGameDataSendingType()"></app-game-menu>
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
            (logDataEmitter)="
              logData['ai-socket menu'] = $event
            "></app-ai-socket-menu>
        </div>
        <ng-container *ngComponentOutlet="gameWindowComponent"></ng-container>
      }
    </div>
    <div
      class="fixed bottom-0 p-10 bg-white border-y-red-600 border-solid border-2 left-0 w-full z-50">
      <app-console [logData]="logData"></app-console>
    </div>
  `,
  imports: [
    NgComponentOutlet,
    GameMenuComponent,
    ConsoleComponent,
    DataMenuComponent,
    AuthRequiredDirective,
    AiSocketMenuComponent,
    RecordPipe,
  ],
})
export class GamePageComponent implements OnInit, AfterViewInit {
  private _route = inject(ActivatedRoute);
  private _router = inject(Router);

  public gameName = '';
  public game: Game | null = null;
  public logData: Record<string, TExchangeData> = {};
  public roleEnum = TRole;

  @ViewChild(NgComponentOutlet)
  public ngComponentOutlet!: NgComponentOutlet;
  public gameWindowComponent: Type<IBaseGameWindowComponent> | null = null;
  public gameWindowComponentInstance: IBaseGameWindowComponent | null = null;

  public ngOnInit(): void {
    this._route.paramMap.subscribe(params => {
      this.gameName = params.get('gameName') || '';
      this.loadGame();
    });

    this.updateGameLogData();
  }

  public ngAfterViewInit(): void {
    if (!this.game) return;
    this.gameWindowComponentInstance = this.ngComponentOutlet['_componentRef']
      .instance as IBaseGameWindowComponent;

    this.updateGameWindowLogData();
  }

  //

  private loadGame(): void {
    const game = games[this.gameName];
    if (!game) {
      this._router.navigate(['']);
    } else {
      this.game = game;
      this.gameWindowComponent = game.getGameWindowComponent();
    }
  }

  private updateGameLogData(): void {
    if (!this.game) return;

    this.logData['game'] = {
      game: this.game.getName(),
      dataSendingType: TGameDataSendingType[this.game.getGameDataSendingType()],
    };
  }

  private updateGameWindowLogData(): void {
    setTimeout(() => {
      if (this.gameWindowComponentInstance === null) return;

      this.logData['game window'] =
        this.gameWindowComponentInstance.gameWindowLogData;
    });
  }
}
