import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { GameEndpointsService } from '@endpoints/game-endpoints.service';
import { StatsEndpointsService } from '@endpoints/stats-endpoints.service';
import {
  IGameResponse,
  IGameStatsResponse,
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
    <span>CHECK MORE...</span>
  `,
})
export class ShortGameStatsComponent implements OnInit, OnDestroy {
  private _gameEndpointsService = inject(GameEndpointsService);
  private _statsEndpointsService = inject(StatsEndpointsService);

  private _getGamesSubscription = new Subscription();
  private _getGameStatsSubscription = new Subscription();

  public gameList: IGameResponse[] | null = null;
  public gameStatsList: IGameStatsResponse[] = [];

  public totalGames = 0;
  public totalPlayers = 0;
  public totalStorage = 0;

  public ngOnInit(): void {
    this._getGamesSubscription = this._gameEndpointsService
      .getGames()
      .subscribe({
        next: (response: IGameResponse[]) => {
          this.gameList = response;
          this.getGameStats();
        },
        error: () => {
          this.gameList = null;
        },
      });
  }

  public getGameStats(): void {
    if (this.gameList) {
      let completedRequests = 0;
      for (const game of this.gameList) {
        this._getGameStatsSubscription = this._statsEndpointsService
          .getGameStats(game.id)
          .subscribe({
            next: (response: IGameStatsResponse) => {
              this.gameStatsList.push(response);
              completedRequests++;

              if (completedRequests === this.gameList?.length) {
                this.countFinalStats();
              }
            },
          });
      }
    }
  }

  public countFinalStats(): void {
    this.gameStatsList.forEach(game => {
      this.totalGames++;
      this.totalPlayers += game.totalPlayers;
      this.totalStorage += game.totalStorageMb;
    });
  }

  public ngOnDestroy(): void {
    this._getGamesSubscription.unsubscribe();
    this._getGameStatsSubscription.unsubscribe();
  }
}
