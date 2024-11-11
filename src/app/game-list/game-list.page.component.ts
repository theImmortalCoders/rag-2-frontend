import {
  AfterViewChecked,
  Component,
  inject,
  OnDestroy,
  OnInit,
} from '@angular/core';
import { RouterModule } from '@angular/router';
import { GameEndpointsService } from '@endpoints/game-endpoints.service';
import {
  IGameResponse,
  IGameStatsResponse,
} from 'app/shared/models/game.models';
import { Subscription } from 'rxjs';
import * as feather from 'feather-icons';
import { StatsEndpointsService } from '@endpoints/stats-endpoints.service';

interface IExtendendGameList {
  id: number;
  name: string;
  description: string;
  isStatsChoosen?: boolean;
}

interface IExtendendGameStats {
  name?: string;
  plays: number;
  totalPlayers: number;
  totalStorageMb: number;
  firstPlayed: string;
  lastPlayed: string;
  statsUpdatedDate: string;
}

@Component({
  selector: 'app-game-list-page',
  standalone: true,
  imports: [RouterModule],
  template: `
    <div class="flex flex-col items-center mt-10 py-9 md:py-14 font-mono">
      <h1
        class="text-center uppercase text-lg 2xs:text-xl xs:text-2xl sm:text-3xl md:text-4xl xl:text-5xl mb-4 md:mb-8 text-mainCreme">
        Check details about our games:
      </h1>
      <div
        class="h-[2px] lg:h-[4px] bg-mainCreme w-full mb-2 xs:mb-4 md:mb-8"></div>
      <div
        class="flex flex-row flex-wrap items-center justify-evenly w-full xl:w-11/12">
        @for (game of extendendGameList; track game.id) {
          <!-- [routerLink]="['/game/', game.name]" -->
          <div
            class="w-[90%] sm:w-[45%] md:w-1/3 lg:w-1/4 h-52 bg-mainGray mx-2 lg:mx-4 xl:mx-8 my-6 p-4 border-mainOrange border-2 rounded-lg text-mainCreme transition-all duration-200 ease-in-out hover:scale-110 relative group">
            <div
              class="absolute z-10 flex flex-row group-hover:flex-col justify-between w-full left-0 bottom-0 py-4 px-3 bg-lightGray opacity-95 rounded-b-lg">
              <div class="flex flex-row justify-between py-0 group-hover:py-2">
                <p class="text-2xl uppercase">{{ game.name }}</p>
                <button
                  (click)="switchView(game.id)"
                  class="w-fit text-sm hidden group-hover:block rounded-md font-bold text-mainGray bg-mainCreme hover:text-mainCreme hover:bg-mainGray ease-in-out transition-all duration-200 px-2 py-0 my-0">
                  {{ isStatsViewChoosen(game.id) ? 'Description' : 'Stats' }}
                </button>
              </div>
              <i
                data-feather="corner-right-up"
                class="pr-2 group-hover:hidden size-8"></i>
              <div class="text-2xs hidden text-lightOragne group-hover:block">
                @if (isStatsViewChoosen(game.id)) {
                  <p>statystyki</p>
                } @else {
                  <p>{{ game.description }}</p>
                }
              </div>
            </div>
            <img
              src="images/{{ game.name }}.jpg"
              alt="{{ game.name }}"
              class="w-full h-full object-cover rounded-xl" />
          </div>
        }
      </div>
    </div>
  `,
})
export class GameListPageComponent
  implements OnInit, OnDestroy, AfterViewChecked
{
  private _gameEndpointsService = inject(GameEndpointsService);
  private _statsEndpointsService = inject(StatsEndpointsService);

  private _getGamesSubscription = new Subscription();
  private _getGameStatsSubscription = new Subscription();

  private _gameList: IGameResponse[] | null = null;

  public extendendGameList: IExtendendGameList[] = [];
  public gameStatsList: IExtendendGameStats[] = [];

  public ngOnInit(): void {
    this._getGamesSubscription = this._gameEndpointsService
      .getGames()
      .subscribe({
        next: (response: IGameResponse[]) => {
          this._gameList = response;
          this.extendendGameList = this._gameList;
          this.getGameStats();
          this.createNewList();
        },
        error: () => {
          this._gameList = null;
        },
      });
  }

  public ngAfterViewChecked(): void {
    feather.replace(); //dodane, żeby feather-icons na nowo dodało się do DOM w pętli
  }

  public getGameStats(): void {
    if (this._gameList) {
      for (let i = 0; i < this._gameList.length; i++) {
        this._getGameStatsSubscription = this._statsEndpointsService
          .getGameStats(this._gameList[i].id)
          .subscribe({
            next: (response: IGameStatsResponse) => {
              this.gameStatsList[i] = response;
              if (this._gameList) {
                this.gameStatsList[i].name = this._gameList[i].name;
              }
            },
          });
      }
    }
  }

  public createNewList(): void {
    if (this._gameList) {
      for (let i = 0; i < this._gameList?.length; i++) {
        this.extendendGameList[i] = this._gameList[i];
        this.extendendGameList[i].isStatsChoosen = false;
      }
    }
  }

  public switchView(gameId: number): void {
    const selectedGame = this.extendendGameList.find(
      game => game.id === gameId
    );
    if (selectedGame) {
      selectedGame.isStatsChoosen = !selectedGame?.isStatsChoosen;
    }
  }

  public isStatsViewChoosen(gameId: number): boolean {
    const selectedGame = this.extendendGameList.find(
      game => game.id === gameId
    );
    return selectedGame?.isStatsChoosen ? selectedGame.isStatsChoosen : false;
  }

  public ngOnDestroy(): void {
    this._getGamesSubscription.unsubscribe();
    this._getGameStatsSubscription.unsubscribe();
  }
}
