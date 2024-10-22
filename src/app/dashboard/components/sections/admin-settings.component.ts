import { Component, inject } from '@angular/core';
import { ModalComponent } from '../modal.component';
import { AdministrationEndpointsService } from '@endpoints/administration-endpoints.service';
import { NotificationService } from 'app/shared/services/notification.service';
import { NonNullableFormBuilder } from '@angular/forms';
import { Subscription } from 'rxjs';
import { IUserResponse } from 'app/shared/models/user.models';

@Component({
  selector: 'app-admin-settings',
  standalone: true,
  imports: [ModalComponent],
  template: `
    <h1 class="text-4xl font-bold text-mainOrange">Administration settings</h1>
    <hr class="w-full border-2 border-mainOrange mb-4" />
    <div class="flex flex-row justify-around space-x-8">
      <button
        type="button"
        (click)="banUnbanUserModal()"
        class="flex flex-row items-center justify-center group space-x-2 rounded-lg mt-2 px-3 py-2 bg-mainGray text-mainOrange border-2 border-mainOrange transition-all ease-in-out hover:bg-mainOrange hover:text-mainGray text-base">
        <span>Ban/unban some user</span>
        <i
          data-feather="slash"
          class="text-mainOrange group-hover:text-mainGray transition-all ease-in-out size-4 xs:size-5"></i>
      </button>
      <button
        type="button"
        (click)="changeUserRoleModal()"
        class="flex flex-row items-center justify-center group space-x-2 rounded-lg mt-2 px-3 py-2 bg-mainGray text-mainOrange border-2 border-mainOrange transition-all ease-in-out hover:bg-mainOrange hover:text-mainGray text-base">
        <span>Change role of some user</span>
        <i
          data-feather="edit"
          class="text-mainOrange group-hover:text-mainGray transition-all ease-in-out size-4 xs:size-5"></i>
      </button>
      <button
        type="button"
        (click)="getUserDetailsModal()"
        class="flex flex-row items-center justify-center group space-x-2 rounded-lg mt-2 px-3 py-2 bg-mainGray text-mainOrange border-2 border-mainOrange transition-all ease-in-out hover:bg-mainOrange hover:text-mainGray text-base">
        <span>Get details of some user</span>
        <i
          data-feather="eye"
          class="text-mainOrange group-hover:text-mainGray transition-all ease-in-out size-4 xs:size-5"></i>
      </button>
    </div>
    @if (modalVisibility !== null) {
      <app-modal (closeModal)="hideModal()">
        <div class="flex flex-col items-start w-full font-mono">
          <h2 class="text-3xl text-mainCreme font-bold mb-10">
            {{ modalTitle }}
          </h2>
          <div class="flex flex-col space-y-4 w-full">
            <select
              id="selectedUserId"
              class="custom-input"
              value=""
              (change)="setSelectedUserId($event)">
              <option value="0">Choose one of the users</option>
              @for (user of usersList; track user.id) {
                <option [value]="user.id">
                  {{ user.name }}, {{ user.email }}
                </option>
              }
            </select>
          </div>
          @if (modalButtonText !== null) {
            <button
              class="flex flex-row w-full items-center justify-center group space-x-2 rounded-lg mt-6 px-3 py-2 bg-mainGray text-mainOrange border-2 border-mainOrange transition-all ease-in-out hover:bg-mainOrange hover:text-mainGray text-base"
              (click)="modalButtonFunction()">
              {{ modalButtonText }}
            </button>
          }
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
export class AdminSettingsComponent {
  private _adminEndpointsService = inject(AdministrationEndpointsService);
  private _notificationService = inject(NotificationService);

  private _getUsersSubscription: Subscription | null = null;

  public selectedUserId = 0;

  public usersList: IUserResponse[] | null = null;

  public errorMessage: string | null = null;

  public modalVisibility:
    | 'banUnbanUser'
    | 'changeUserRole'
    | 'getUserDetails'
    | null = null;
  public modalTitle = '';
  public modalButtonText: string | null = '';
  public modalButtonFunction!: () => void;

  public setSelectedUserId(event: Event): void {
    const target = event.target as HTMLSelectElement;
    const selectedId = target?.value;
    this.selectedUserId = parseInt(selectedId, 10);
  }

  public getUsersList(): void {
    this._getUsersSubscription = this._adminEndpointsService
      .getUsers()
      .subscribe({
        next: (response: IUserResponse[]) => {
          this.usersList = response;
        },
      });
  }

  public banUnbanUserModal(): void {
    this.modalVisibility = 'banUnbanUser';
    this.modalTitle = 'Changing ban status of user';
    this.modalButtonText = 'Change ban status';
    this.modalButtonFunction = this.banUnbanUserFunction;
    this.errorMessage = null;
    this.getUsersList();
  }

  public changeUserRoleModal(): void {
    this.modalVisibility = 'changeUserRole';
    this.modalTitle = 'Changing user role';
    this.modalButtonText = 'Change user role';
    this.modalButtonFunction = this.changeUserRoleFunction;
    this.errorMessage = null;
    this.getUsersList();
  }

  public getUserDetailsModal(): void {
    this.modalVisibility = 'getUserDetails';
    this.modalTitle = 'Checking user details';
    this.modalButtonText = null;
    this.errorMessage = null;
    this.getUsersList();
  }

  public banUnbanUserFunction(): void {
    //
  }

  public changeUserRoleFunction(): void {
    //
  }

  public hideModal(): void {
    this.modalVisibility = null;
  }
}
