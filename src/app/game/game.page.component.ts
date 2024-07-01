import { Component, OnInit, Type, inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NgComponentOutlet } from '@angular/common';
import { BaseGameWindowComponent } from './components/games/base-game.component';
import { Game } from './models/game';
import { GameMenuComponent } from './components/menu/game-menu.component';
import { games } from './data-access/games';

@Component({
  selector: 'app-game',
  standalone: true,
  template: `
    <div class="min-h-screen w-full">
      @if (game) {
        <app-game-menu
          [gameDataSendingType]="game.getGameDataSendingType()"></app-game-menu>
        <ng-container *ngComponentOutlet="gameWindowComponent"></ng-container>
      }
    </div>
  `,
  imports: [NgComponentOutlet, GameMenuComponent],
})
export class GamePageComponent implements OnInit {
  private _route = inject(ActivatedRoute);
  private _router = inject(Router);

  public gameName = '';
  public game: Game | null = null;
  public gameWindowComponent: Type<BaseGameWindowComponent> | null = null;

  ngOnInit() {
    this._route.paramMap.subscribe(params => {
      console.log(params);
      this.gameName = params.get('gameName') || '';
      this.loadGame();
    });
  }

  private loadGame() {
    let game = games[this.gameName];
    if (!game) {
      this._router.navigate(['']);
    } else {
      this.game = game;
      this.gameWindowComponent = game.getGameWindowComponent();
    }
  }
}
