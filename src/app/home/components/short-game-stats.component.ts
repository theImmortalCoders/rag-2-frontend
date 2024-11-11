import {
  Component,
  ElementRef,
  inject,
  OnDestroy,
  OnInit,
} from '@angular/core';
import { StatsEndpointsService } from '@endpoints/stats-endpoints.service';
import { IOverallStatsResponse } from 'app/shared/models/game.models';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-short-game-stats',
  standalone: true,
  imports: [],
  template: `
    <h2
      class="text-lg md:text-xl lg:text-2xl pb-4 text-center text-mainCreme font-bold uppercase tracking-widest">
      Overall page stats
    </h2>
    <div
      class="grid grid-cols-2 grid-rows-2 size-52 sm:size-56 md:size-64 lg:size-72 text-mainOrange">
      <div
        class="flex flex-col items-center justify-center border-b border-r border-mainCreme">
        <span class="text-xl md:text-2xl lg:text-3xl font-black">{{
          displayTotalGames
        }}</span>
        <span class="text-base md:text-lg lg:text-xl">games</span>
      </div>
      <div
        class="flex flex-col items-center justify-center border-b border-l border-mainCreme">
        <span class="text-xl md:text-2xl lg:text-3xl font-black">{{
          displayTotalPlayers
        }}</span>
        <span class="text-base md:text-lg lg:text-xl">players</span>
      </div>
      <div
        class="flex flex-col items-center justify-center border-t border-r border-mainCreme">
        <span class="text-xl md:text-2xl lg:text-3xl font-black">{{
          displayTotalPlays
        }}</span>
        <span class="text-base md:text-lg lg:text-xl">total plays</span>
      </div>
      <div
        class="flex flex-col items-center justify-center border-t border-l border-mainCreme">
        <span class="text-xl md:text-2xl lg:text-3xl font-black">{{
          displayTotalStorage
        }}</span>
        <span class="text-base md:text-lg lg:text-xl">MB of data</span>
      </div>
    </div>
    <a class="group">
      <div class="flex flex-row justify-center items-center w-full">
        <h2
          class="text-sm md:text-base lg:text-lg pt-2 md:pt-4 text-center text-mainOrange group-hover:text-green-500 font-bold uppercase tracking-widest ease-in-out transition-all duration-500">
          Check some details...
        </h2>
      </div>
      <hr
        class="border-mainOrange group-hover:border-green-500 w-0 group-hover:w-full ease-in-out transition-all duration-500" />
    </a>
  `,
})
export class ShortGameStatsComponent implements OnInit, OnDestroy {
  private _statsEndpointsService = inject(StatsEndpointsService);
  private _elementRef = inject(ElementRef);

  private _getOverallStatsSubscription = new Subscription();
  private _observer: IntersectionObserver | null = null;

  public overallStats: IOverallStatsResponse | null = null;

  public displayTotalGames: number | string = 0;
  public displayTotalPlayers: number | string = 0;
  public displayTotalPlays: number | string = 0;
  public displayTotalStorage: number | string = 0;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  private _intervalIds: Record<string, any> = {};

  public ngOnInit(): void {
    this._observer = new IntersectionObserver(
      entries => {
        const entry = entries[0];
        if (entry.isIntersecting) {
          this._getOverallStatsSubscription = this._statsEndpointsService
            .getOverallStats()
            .subscribe({
              next: (response: IOverallStatsResponse) => {
                this.overallStats = response;
                this.callAnimation();
              },
              error: () => {
                this.overallStats = null;
              },
            });
          if (this._observer) {
            this._observer.disconnect();
          }
        }
      },
      {
        threshold: 0.3,
      }
    );

    if (this._elementRef.nativeElement) {
      this._observer.observe(this._elementRef.nativeElement);
    }
  }

  private callAnimation(): void {
    if (this.overallStats) {
      this.animateStats('displayTotalGames', this.overallStats.gamesAmount);
      this.animateStats('displayTotalPlayers', this.overallStats.playersAmount);
      this.animateStats(
        'displayTotalPlays',
        this.overallStats.gameRecordsAmount
      );
      this.animateStats(
        'displayTotalStorage',
        this.overallStats.totalMemoryMb.toPrecision(2)
      );
    }
  }

  private animateStats(
    property:
      | 'displayTotalGames'
      | 'displayTotalPlayers'
      | 'displayTotalPlays'
      | 'displayTotalStorage',
    finalValue: number | string
  ): void {
    const maxRandomMultiplier = 4;
    const intervalTime = 25;
    const animationDuration = 1000;
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
    this._getOverallStatsSubscription.unsubscribe();

    Object.values(this._intervalIds).forEach(interval =>
      clearInterval(interval)
    );

    if (this._observer) {
      this._observer.disconnect();
    }
  }
}