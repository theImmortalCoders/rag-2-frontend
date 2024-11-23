/* eslint-disable max-lines */
import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { ModalComponent } from '../../shared/modal.component';
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
    <button
      (click)="showOptions()"
      class="flex flex-row justify-between text-xl xs:text-2xl sm:text-4xl font-bold text-mainOrange text-center 2xs:text-start">
      <span> Game handling options </span>
      <div
        class="flex items-center justify-center w-fit ease-in-out duration-300 transition-all {{
          isOptionsVisible ? 'rotate-180' : 'rotate-0'
        }}">
        <i data-feather="chevron-down" class="size-6 xs:size-8"></i>
      </div>
    </button>
    <hr class="w-full border-[1px] sm:border-2 border-mainOrange mb-4" />
    <div
      class="relative ease-in-out duration-150 transition-all {{
        isOptionsVisible
          ? 'top-0 opacity-100 z-30 h-fit'
          : '-top-32 xs:-top-16 opacity-0 -z-50 h-0'
      }}">
      <div
        class="flex flex-col xs:flex-row justify-start gap-y-2 xs:gap-y-0 space-x-0 xs:space-x-6 lg:space-x-20 w-full">
        <button
          type="button"
          (click)="addNewGameModal()"
          class="dashboard-button group">
          <span>Add new game to system</span>
          <i data-feather="plus-square" class="dashboard-icon"></i>
        </button>
        <button
          type="button"
          (click)="editGameModal()"
          class="dashboard-button group">
          <span>Edit existing game</span>
          <i data-feather="edit" class="dashboard-icon"></i>
        </button>
        <button
          type="button"
          (click)="removeGameModal()"
          class="dashboard-button group">
          <span>Remove existing game</span>
          <i data-feather="trash-2" class="dashboard-icon"></i>
        </button>
      </div>
      @if (modalVisibility !== null) {
        <app-modal (closeModal)="hideModal()">
          <div class="flex flex-col items-start w-full font-mono">
            <h2
              class="text-2xl sm:text-3xl text-mainCreme font-bold mb-2 xs:mb-6 sm:mb-10">
              {{ modalTitle }}
            </h2>
            <form
              [formGroup]="gameHandlingForm"
              class="flex flex-col space-y-4 w-full text-sm sm:text-base">
              @if (modalVisibility === 'addNewGame') {
                <div class="flex flex-col space-y-1">
                  <label for="newGameName" class="text-start">Game name</label>
                  <input
                    id="newGameName"
                    type="text"
                    formControlName="newGameName"
                    placeholder="Type new game name"
                    class="custom-input" />
                  <label for="newGameDescription" class="text-start"
                    >Game description</label
                  >
                  <textarea
                    id="newGameDescription"
                    type="text"
                    formControlName="newGameDescription"
                    placeholder="Type new game description"
                    class="custom-input resize-none"
                    [rows]="5"
                    [maxlength]="280"></textarea>
                </div>
              } @else if (
                (modalVisibility === 'editGame' ||
                  modalVisibility === 'removeGame') &&
                gameList !== null
              ) {
                <select
                  id="selectedGameId"
                  class="custom-input"
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
                  <label for="editedGameDescription" class="text-start"
                    >Edited game description</label
                  >
                  <textarea
                    id="editedGameDescription"
                    type="text"
                    formControlName="editedGameDescription"
                    placeholder="Type edited game description"
                    class="custom-input resize-none"
                    [rows]="5"
                    [maxlength]="280"></textarea>
                </div>
              }
            </form>
            <button
              class="flex flex-row w-full items-center justify-center group space-x-2 rounded-lg mt-4 xs:mt-6 px-2 xs:px-3 py-1 xs:py-2 bg-mainGray text-mainOrange border-2 border-mainOrange transition-all ease-in-out hover:bg-mainOrange hover:text-mainGray text-base"
              (click)="modalButtonFunction()">
              {{ modalButtonText }}
            </button>
            <button
              (click)="hideModal()"
              class="absolute top-1 sm:top-2 right-2 sm:right-4 text-3xl sm:text-5xl text-mainOrange hover:text-mainGray">
              x
            </button>
            <div class="text-red-500 mt-6 text-sm sm:text-base">
              @if (errorMessage !== null) {
                <p>{{ errorMessage }}</p>
              }
            </div>
          </div>
        </app-modal>
      }
    </div>
  `,
})
export class GameHandlingOptionsComponent implements OnDestroy {
  private _gameEndpointsService = inject(GameEndpointsService);
  private _notificationService = inject(NotificationService);
  private _formBuilder = inject(NonNullableFormBuilder);

  private _getGamesSubscription = new Subscription();
  private _addGameSubscription = new Subscription();
  private _editGameSubscription = new Subscription();
  private _removeGameSubscription = new Subscription();

  public selectedGameId = 0;

  public gameHandlingForm = this._formBuilder.group({
    newGameName: ['', [Validators.required]],
    newGameDescription: ['', [Validators.required]],
    editedGameName: ['', [Validators.required]],
    editedGameDescription: ['', [Validators.required]],
  });

  public gameList: IGameResponse[] | null = null;

  public errorMessage: string | null = null;
  public isOptionsVisible = false;

  public modalVisibility: 'addNewGame' | 'editGame' | 'removeGame' | null =
    null;
  public modalTitle = '';
  public modalButtonText = '';
  public modalButtonFunction!: () => void;

  public showOptions(): void {
    this.isOptionsVisible = !this.isOptionsVisible;
  }

  public setSelectedGameId(event: Event): void {
    const target = event.target as HTMLSelectElement;
    const selectedId = target?.value;
    this.selectedGameId = parseInt(selectedId, 10);
    const selectedGame = this.gameList?.find(
      game => game.id === this.selectedGameId
    );
    const selectedGameName = selectedGame ? selectedGame.name : '';
    const selectedGameDesctiption = selectedGame
      ? selectedGame.description
      : '';
    this.gameHandlingForm.controls.editedGameName.setValue(selectedGameName);
    this.gameHandlingForm.controls.editedGameDescription.setValue(
      selectedGameDesctiption
    );
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
    this.gameHandlingForm.reset();
  }

  public editGameModal(): void {
    this.modalVisibility = 'editGame';
    this.modalTitle = 'Editing existing game';
    this.modalButtonText = 'Edit game name';
    this.modalButtonFunction = this.editGameFunction;
    this.errorMessage = null;
    this.getGameList();
    this.gameHandlingForm.reset();
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
    if (
      this.gameHandlingForm.value.newGameName &&
      this.gameHandlingForm.value.newGameDescription
    ) {
      const formValues = this.gameHandlingForm.value;
      if (formValues.newGameName && formValues.newGameDescription) {
        const gameData: IGameRequest = {
          name: formValues.newGameName,
          description: formValues.newGameDescription,
        };
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
      this.gameHandlingForm.value.editedGameDescription &&
      this.selectedGameId !== 0
    ) {
      const formValues = this.gameHandlingForm.value;
      if (formValues.editedGameName && formValues.editedGameDescription) {
        const gameData: IGameRequest = {
          name: formValues.editedGameName,
          description: formValues.editedGameDescription,
        };
        this._editGameSubscription = this._gameEndpointsService
          .updateGame(this.selectedGameId, gameData)
          .subscribe({
            next: () => {
              this._notificationService.addNotification(
                'Existing game has been edited!',
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
    this.errorMessage = null;
    if (this.selectedGameId !== 0) {
      this._removeGameSubscription = this._gameEndpointsService
        .deleteGame(this.selectedGameId)
        .subscribe({
          next: () => {
            this._notificationService.addNotification(
              'Existing game has been deleted!',
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

  public ngOnDestroy(): void {
    this._getGamesSubscription.unsubscribe();
    this._addGameSubscription.unsubscribe();
    this._editGameSubscription.unsubscribe();
    this._removeGameSubscription.unsubscribe();
  }
}
