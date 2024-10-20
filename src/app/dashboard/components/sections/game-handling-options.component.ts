/* eslint-disable max-lines */
import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { ModalComponent } from '../modal.component';
import { GameEndpointsService } from '@endpoints/game-endpoints.service';
import { NotificationService } from 'app/shared/services/notification.service';
import { Subscription } from 'rxjs';
import { IGameRequest, IGameResponse } from 'app/shared/models/game.models';
import {
  NonNullableFormBuilder,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';

@Component({
  selector: 'app-game-handling-options',
  standalone: true,
  imports: [ModalComponent, ReactiveFormsModule],
  template: `
    <h1 class="text-4xl font-bold text-mainOrange">Game handling options</h1>
    <hr class="w-5/6 border-2 border-mainOrange mb-4" />
    <div class="flex flex-row justify-around space-x-8">
      <button
        type="button"
        (click)="addNewGameModal()"
        class="flex flex-row items-center justify-center group space-x-2 rounded-lg mt-2 px-3 py-2 bg-mainGray text-mainOrange border-2 border-mainOrange transition-all ease-in-out hover:bg-mainOrange hover:text-mainGray text-base">
        <span>Add new game to system</span>
        <i
          data-feather="plus-square"
          class="text-mainOrange group-hover:text-mainGray transition-all ease-in-out size-4 xs:size-5"></i>
      </button>
      <button
        type="button"
        (click)="editGameModal()"
        class="flex flex-row items-center justify-center group space-x-2 rounded-lg mt-2 px-3 py-2 bg-mainGray text-mainOrange border-2 border-mainOrange transition-all ease-in-out hover:bg-mainOrange hover:text-mainGray text-base">
        <span>Edit existing game</span>
        <i
          data-feather="edit"
          class="text-mainOrange group-hover:text-mainGray transition-all ease-in-out size-4 xs:size-5"></i>
      </button>
      <button
        type="button"
        (click)="removeGameModal()"
        class="flex flex-row items-center justify-center group space-x-2 rounded-lg mt-2 px-3 py-2 bg-mainGray text-mainOrange border-2 border-mainOrange transition-all ease-in-out hover:bg-mainOrange hover:text-mainGray text-base">
        <span>Remove existing game</span>
        <i
          data-feather="trash-2"
          class="text-mainOrange group-hover:text-mainGray transition-all ease-in-out size-4 xs:size-5"></i>
      </button>
    </div>
    @if (modalVisibility !== null) {
      <app-modal (closeModal)="hideModal()">
        <div class="flex flex-col items-start font-mono">
          <h2 class="text-3xl text-mainCreme font-bold mb-10">
            {{ modalTitle }}
          </h2>
          <form
            [formGroup]="gameHandlingForm"
            class="flex flex-col space-y-4 w-full">
            @if (modalVisibility === 'addNewGame') {
              <div class="flex flex-col space-y-1">
                <label for="newGameName" class="text-start"
                  >New game name</label
                >
                <input
                  id="newGameName"
                  type="text"
                  formControlName="newGameName"
                  placeholder="Type new game name"
                  class="custom-input" />
              </div>
            } @else if (
              (modalVisibility === 'editGame' ||
                modalVisibility === 'removeGame') &&
              gameList !== null
            ) {
              <select
                id="selectedGameId"
                class="custom-input"
                value=""
                (change)="setSelectedGameId($event)">
                <option value="0">Choose existing game</option>
                @for (game of gameList; track game.id) {
                  <option [value]="game.id">{{ game.name }}</option>
                }
              </select>
            }
            @if (modalVisibility === 'editGame') {
              <div class="flex flex-col space-y-1">
                <label for="editedGameName" class="text-start"
                  >Edited game name</label
                >
                <input
                  id="editedGameName"
                  type="text"
                  formControlName="editedGameName"
                  placeholder="Type edited game name"
                  class="custom-input" />
              </div>
            }
          </form>
          <button
            class="flex flex-row w-full items-center justify-center group space-x-2 rounded-lg mt-6 px-3 py-2 bg-mainGray text-mainOrange border-2 border-mainOrange transition-all ease-in-out hover:bg-mainOrange hover:text-mainGray text-base"
            (click)="modalButtonFunction()">
            {{ modalButtonText }}
          </button>
          <button
            (click)="hideModal()"
            class="absolute top-2 right-4 text-5xl text-mainOrange hover:text-mainGray">
            x
          </button>
          <div class="text-red-500 mt-6">
            @if (errorMessage !== null) {
              <p>{{ errorMessage }}</p>
            }
          </div>
        </div>
      </app-modal>
    }
  `,
})
export class GameHandlingOptionsComponent implements OnDestroy {
  private _gameEndpointsService = inject(GameEndpointsService);
  private _notificationService = inject(NotificationService);
  private _formBuilder = inject(NonNullableFormBuilder);

  private _getGamesSubscription: Subscription | null = null;
  private _addGameSubscription: Subscription | null = null;
  private _editGameSubscription: Subscription | null = null;
  private _removeGameSubscription: Subscription | null = null;

  public selectedGameId = 0;

  public gameHandlingForm = this._formBuilder.group({
    newGameName: ['', [Validators.required]],
    editedGameName: ['', [Validators.required]],
  });

  public gameList: IGameResponse[] | null = null;

  public errorMessage: string | null = null;

  public modalVisibility: 'addNewGame' | 'editGame' | 'removeGame' | null =
    null;
  public modalTitle = '';
  public modalButtonText = '';
  public modalButtonFunction!: () => void;

  public setSelectedGameId(event: Event): void {
    const target = event.target as HTMLSelectElement;
    const selectedId = target?.value;
    this.selectedGameId = parseInt(selectedId, 10);
  }

  public getGameList(): void {
    this._getGamesSubscription = this._gameEndpointsService
      .getGames()
      .subscribe({
        next: (response: IGameResponse[]) => {
          this.gameList = response;
        },
      });
  }

  public addNewGameModal(): void {
    this.modalVisibility = 'addNewGame';
    this.modalTitle = 'Adding new game';
    this.modalButtonText = 'Add new game';
    this.modalButtonFunction = this.addNewGameFunction;
    this.errorMessage = null;
  }

  public editGameModal(): void {
    this.modalVisibility = 'editGame';
    this.modalTitle = 'Editing existing game';
    this.modalButtonText = 'Edit game';
    this.modalButtonFunction = this.editGameFunction;
    this.errorMessage = null;
    this.getGameList();
  }

  public removeGameModal(): void {
    this.modalVisibility = 'removeGame';
    this.modalTitle = 'Removing existing game';
    this.modalButtonText = 'Remove game';
    this.modalButtonFunction = this.removeGameFunction;
    this.errorMessage = null;
    this.getGameList();
  }

  public hideModal(): void {
    this.modalVisibility = null;
  }

  public addNewGameFunction(): void {
    this.errorMessage = null;
    if (this.gameHandlingForm.value.newGameName) {
      const formValues = this.gameHandlingForm.value;
      if (formValues.newGameName) {
        const gameData: IGameRequest = { name: formValues.newGameName };
        this._addGameSubscription = this._gameEndpointsService
          .addGame(gameData)
          .subscribe({
            next: () => {
              this._notificationService.addNotification(
                'New game has been added!',
                3000
              );
              this.errorMessage = null;
              this.modalVisibility = null;
            },
            error: (error: string) => {
              this.errorMessage = error;
            },
          });
      }
    }
  }

  public editGameFunction(): void {
    this.errorMessage = null;
    if (
      this.gameHandlingForm.value.editedGameName &&
      this.selectedGameId !== 0
    ) {
      const formValues = this.gameHandlingForm.value;
      if (formValues.editedGameName) {
        const gameData: IGameRequest = { name: formValues.editedGameName };
        this._editGameSubscription = this._gameEndpointsService
          .updateGame(this.selectedGameId, gameData)
          .subscribe({
            next: () => {
              this._notificationService.addNotification(
                'Existing game name has been changed!',
                3000
              );
              this.errorMessage = null;
              this.modalVisibility = null;
            },
            error: (error: string) => {
              this.errorMessage = error;
            },
          });
      }
    }
  }

  public removeGameFunction(): void {
    //
  }

  public ngOnDestroy(): void {
    if (this._getGamesSubscription) {
      this._getGamesSubscription.unsubscribe();
    }
    if (this._addGameSubscription) {
      this._addGameSubscription.unsubscribe();
    }
    if (this._editGameSubscription) {
      this._editGameSubscription.unsubscribe();
    }
    if (this._removeGameSubscription) {
      this._removeGameSubscription.unsubscribe();
    }
  }
}
