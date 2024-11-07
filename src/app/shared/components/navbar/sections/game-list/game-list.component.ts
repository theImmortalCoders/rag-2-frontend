import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import { GameEndpointsService } from '@endpoints/game-endpoints.service';
import { IGameResponse } from 'app/shared/models/game.models';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-game-list',
  standalone: true,
  imports: [RouterModule],
  template: `
    <ul class="text-base xs:text-lg space-y-2 px-4 py-4">
      @for (game of games; track game.id) {
        <li class="w-full group">
          <a
            [routerLink]="['game/', game.name]"
            class="flex flex-row justify-between items-center">
            <span
              class="uppercase text-mainOrange group-hover:text-green-500 ease-in-out transition-all duration-500"
              >{{ game.name }}</span
            >
            <i
              data-feather="corner-down-right"
              class="size-4 xs:size-5 ease-in-out transition-all duration-500 opacity-0 group-hover:opacity-100 text-mainOrange group-hover:text-green-500"></i>
          </a>
          <hr
            class="border-mainOrange group-hover:border-green-500 w-3/5 2xl:w-1/2 group-hover:w-full ease-in-out transition-all duration-500" />
        </li>
      }
      <li class="text-sm xs:text-base text-start 3xl:text-center">
        Read more about our games...
      </li>
    </ul>
  `,
})
export class GameListComponent implements OnInit, OnDestroy {
  private _gameEndpointsService = inject(GameEndpointsService);

  private _getGamesSubscription = new Subscription();

  public games: IGameResponse[] | null = null;

  public ngOnInit(): void {
    this._getGamesSubscription = this._gameEndpointsService
      .getGames()
      .subscribe({
        next: (response: IGameResponse[]) => {
          this.games = response;
        },
        error: () => {
          this.games = null;
        },
      });
  }

  public ngOnDestroy(): void {
    this._getGamesSubscription.unsubscribe();
  }
}
