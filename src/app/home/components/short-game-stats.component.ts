import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { GameEndpointsService } from '@endpoints/game-endpoints.service';
import { StatsEndpointsService } from '@endpoints/stats-endpoints.service';
import {
  IGameResponse,
  IOverallStatsResponse,
} from 'app/shared/models/game.models';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-short-game-stats',
  standalone: true,
  imports: [],
  template: `
    <div class="text-2xl text-mainOrange font-mono">Wanna see some stats?</div>
    <div
      class="flex flex-col w-fit xs:w-2/5 items-start justify-center text-lg sm:text-2xl md:text-3xl lg:text-4xl space-y-1 md:space-y-5 text-mainOrange border-l-2 border-mainOrange font-mono p-2 md:p-4 mt-8 xs:mt-0">
      <span>{{ displayTotalGames }} games</span>
      <span>{{ displayTotalPlayers }} players</span>
      <span>{{ displayTotalStorage }} MB of data</span>
      <span>CHECK DETAILS...</span>
    </div>
  `,
})
export class ShortGameStatsComponent implements OnInit, OnDestroy {
  private _gameEndpointsService = inject(GameEndpointsService);
  private _statsEndpointsService = inject(StatsEndpointsService);

  private _getGamesSubscription = new Subscription();
  private _getOverallStatsSubscription = new Subscription();

  public totalGames = 0;
  public totalPlayers = 0;
  public totalStorage = 0;

  public displayTotalGames: number | string = 0;
  public displayTotalPlayers: number | string = 0;
  public displayTotalStorage: number | string = 0;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  private _intervalIds: Record<string, any> = {};

  public ngOnInit(): void {
    this._getGamesSubscription = this._gameEndpointsService
      .getGames()
      .subscribe({
        next: (response: IGameResponse[]) => {
          this.totalGames = response.length;
          this.animateStat('displayTotalGames', this.totalGames);
        },
      });

    this._getOverallStatsSubscription = this._statsEndpointsService
      .getOverallStats()
      .subscribe({
        next: (response: IOverallStatsResponse) => {
          this.totalPlayers = response.playersAmount;
          this.totalStorage = response.totalMemoryMb;
          this.animateStat('displayTotalPlayers', this.totalPlayers);
          this.animateStat(
            'displayTotalStorage',
            this.totalStorage.toPrecision(2)
          );
        },
      });
  }

  private animateStat(
    property:
      | 'displayTotalGames'
      | 'displayTotalPlayers'
      | 'displayTotalStorage',
    finalValue: number | string
  ): void {
    const maxRandomMultiplier = 10;
    const intervalTime = 25;
    const animationDuration = 500;
    let elapsedTime = 0;

    this._intervalIds[property] = setInterval(() => {
      this[property] = Math.floor(
        Math.random() * +finalValue * maxRandomMultiplier
      );
      elapsedTime += intervalTime;

      if (elapsedTime >= animationDuration) {
        clearInterval(this._intervalIds[property]);
        this[property] = finalValue;
      }
    }, intervalTime);
  }

  public ngOnDestroy(): void {
    this._getGamesSubscription.unsubscribe();
    this._getOverallStatsSubscription.unsubscribe();

    // Usuń interwały, jeśli istnieją
    Object.values(this._intervalIds).forEach(interval =>
      clearInterval(interval)
    );
  }
}
