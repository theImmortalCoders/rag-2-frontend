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
import { BaseGameWindowComponent } from './components/games/base-game.component';
import { Game } from './models/game.class';
import { GameMenuComponent } from './components/menu/game-menu.component';
import { games } from './data-access/games';
import { ConsoleComponent } from './components/console/console.component';
import { TGameDataSendingType } from './models/game-data-sending-type.enum';
import { TLogData } from './models/log-data.type';
import { DataMenuComponent } from './components/data-menu/data-menu.component';
import { AllowedRolesDirective } from '../shared/directives/allowed-roles.directive';
import { TRole } from '../shared/models/role.enum';
import { AuthRequiredDirective } from '../shared/directives/auth-required.directive';

@Component({
  selector: 'app-game',
  standalone: true,
  template: `
    <div class="min-h-screen w-full">
      @if (game) {
        <app-game-menu
          (logDataEmitter)="logData['menu'] = $event"
          [gameDataSendingType]="game.getGameDataSendingType()"></app-game-menu>
        <app-data-menu
          *appAuthRequired
          (logDataEmitter)="logData['data menu'] = $event"></app-data-menu>
        <ng-container *ngComponentOutlet="gameWindowComponent"></ng-container>
      }
    </div>
    <app-console [logData]="logData"></app-console>
  `,
  imports: [
    NgComponentOutlet,
    GameMenuComponent,
    ConsoleComponent,
    DataMenuComponent,
    AuthRequiredDirective,
    AllowedRolesDirective,
  ],
})
export class GamePageComponent implements OnInit, AfterViewInit {
  private _route = inject(ActivatedRoute);
  private _router = inject(Router);

  public gameName = '';
  public game: Game | null = null;
  public logData: Record<string, TLogData> = {};
  public roleEnum = TRole;

  @ViewChild(NgComponentOutlet)
  public ngComponentOutlet!: NgComponentOutlet;
  public gameWindowComponent: Type<BaseGameWindowComponent> | null = null;
  public gameWindowComponentInstance: BaseGameWindowComponent | null = null;

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
      .instance as BaseGameWindowComponent;

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
