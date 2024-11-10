import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { GameEndpointsService } from '@endpoints/game-endpoints.service';
import { StatsEndpointsService } from '@endpoints/stats-endpoints.service';
import {
  IGameResponse,
  IGameStatsResponse,
  IOverallStatsResponse,
} from 'app/shared/models/game.models';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-short-game-stats',
  standalone: true,
  imports: [],
  template: `
    <span>{{ totalGames }} games</span>
    <span>{{ totalPlayers }} players</span>
    <span>{{ totalStorage.toPrecision(2) }} MB of data</span>
    <span>CHECK DETAILS...</span>
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

  public ngOnInit(): void {
    this._getGamesSubscription = this._gameEndpointsService
      .getGames()
      .subscribe({
        next: (response: IGameResponse[]) => {
          this.totalGames = response.length;
        },
      });
    this._getOverallStatsSubscription = this._statsEndpointsService
      .getOverallStats()
      .subscribe({
        next: (response: IOverallStatsResponse) => {
          this.totalPlayers = response.playersAmount;
          this.totalStorage = response.totalMemoryMb;
        },
      });
  }

  public ngOnDestroy(): void {
    this._getGamesSubscription.unsubscribe();
    this._getOverallStatsSubscription.unsubscribe();
  }
}
