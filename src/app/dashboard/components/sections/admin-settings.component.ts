/* eslint-disable max-lines */
import { Component, inject, OnDestroy } from '@angular/core';
import { ModalComponent } from '../modal.component';
import { AdministrationEndpointsService } from '@endpoints/administration-endpoints.service';
import { NotificationService } from 'app/shared/services/notification.service';
import { Subscription } from 'rxjs';
import {
  IUserResponse,
  IUserStatsResponse,
} from 'app/shared/models/user.models';
import { TRole } from 'app/shared/models/role.enum';
import { CommonModule } from '@angular/common';
import { StatsEndpointsService } from '@endpoints/stats-endpoints.service';

@Component({
  selector: 'app-admin-settings',
  standalone: true,
  imports: [ModalComponent, CommonModule],
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
              class="custom-input"
              value=""
              (change)="setSelectedUser($event)">
              <option value="0">Choose one of the users</option>
              @for (user of usersList; track user.id) {
                <option [value]="user.id">
                  {{ user.name }}, {{ user.email }}
                </option>
              }
            </select>
          </div>
          @if (
            modalVisibility === 'banUnbanUser' && selectedUserData !== null
          ) {
            <div class="flex flex-row w-full justify-around pt-4">
              <label
                for="banUser"
                class="custom-input-red w-1/4"
                [class.opacity-70]="!isBanned"
                [class.underline]="isBanned">
                <span class="pr-3">BANNED</span>
                <input
                  type="radio"
                  id="banUser"
                  name="banStatus"
                  value="true"
                  [checked]="isBanned"
                  (change)="changeBanStatus($event)" />
              </label>
              <label
                for="unbanUser"
                class="custom-input-green w-1/4"
                [class.opacity-70]="isBanned"
                [class.underline]="!isBanned">
                <span class="pr-3">UNBANNED</span>
                <input
                  type="radio"
                  id="unbanUser"
                  name="banStatus"
                  value="true"
                  [checked]="!isBanned"
                  (change)="changeBanStatus($event)" />
              </label>
            </div>
          } @else if (
            modalVisibility === 'changeUserRole' && selectedUserData !== null
          ) {
            <div class="flex flex-row pt-4">
              <span>Current user role:&nbsp;</span>
              <span class="text-mainOrange font-extrabold uppercase">{{
                selectedUserData.role
              }}</span>
            </div>
            <div class="flex flex-row pt-4">
              <span>Choose new role:&nbsp;</span>
              <select class="custom-input" (click)="setNewUserRole($event)">
                <option value="Student">Student</option>
                <option value="Teacher">Teacher</option>
                <option value="Admin">Admin</option>
                <option value="Special">Special</option>
              </select>
            </div>
          } @else if (
            modalVisibility === 'getUserDetails' &&
            selectedUserData !== null &&
            selectedUserStats !== null
          ) {
            <div class="flex flex-col pt-4 items-start">
              <span>{{ selectedUserData.name }}</span>
              <span>{{ selectedUserData.email }}</span>
              <span>{{ selectedUserData.role }}</span>
              <span>
                {{ selectedUserData.studyCycleYearA }}/{{
                  selectedUserData.studyCycleYearB
                }}
              </span>
              <span>{{
                selectedUserStats.firstPlayed | date: 'dd/MM/yyyy, HH:mm'
              }}</span>
              <span>{{
                selectedUserData.lastPlayed | date: 'dd/MM/yyyy, HH:mm'
              }}</span>
              <span>{{ selectedUserData.banned }}</span>
              <span>{{ selectedUserStats.games }}</span>
              <span>{{ selectedUserStats.plays }}</span>
              <span>{{ selectedUserStats.totalStorageMb }}</span>
            </div>
          }
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
export class AdminSettingsComponent implements OnDestroy {
  private _adminEndpointsService = inject(AdministrationEndpointsService);
  private _statsEndpointsService = inject(StatsEndpointsService);
  private _notificationService = inject(NotificationService);

  private _getUsersSubscription: Subscription | null = null;
  private _getUserStatsSubscription: Subscription | null = null;
  private _changeBanStatusSubscription: Subscription | null = null;
  private _changeRoleSubscription: Subscription | null = null;

  public usersList: IUserResponse[] | null = null;
  public selectedUserData: IUserResponse | null = null;
  public selectedUserStats: IUserStatsResponse | null = null;
  public isBanned = false;
  public newUserRole: TRole = TRole.Student;
  public errorMessage: string | null = null;

  public modalVisibility:
    | 'banUnbanUser'
    | 'changeUserRole'
    | 'getUserDetails'
    | null = null;
  public modalTitle = '';
  public modalButtonText: string | null = '';
  public modalButtonFunction!: () => void;

  public setSelectedUser(event: Event): void {
    const target = event.target as HTMLSelectElement;
    const selectedId = parseInt(target?.value, 10);
    if (this.usersList) {
      this.usersList.map(user => {
        if (user.id === selectedId) {
          this.isBanned = user.banned;
          this.selectedUserData = user;
        }
      });
    }
    if (
      this.modalVisibility === 'getUserDetails' &&
      this.selectedUserData &&
      selectedId !== 0
    ) {
      this._getUserStatsSubscription = this._statsEndpointsService
        .getUserStats(this.selectedUserData.id)
        .subscribe({
          next: (response: IUserStatsResponse) => {
            this.selectedUserStats = response;
          },
          error: () => {
            this.selectedUserStats = null;
          },
        });
    } else {
      this.selectedUserStats = null;
    }
    if (this.selectedUserData === null) {
      this.isBanned = false;
      this.selectedUserData = null;
    }
  }

  public setNewUserRole(event: Event): void {
    const target = event.target as HTMLSelectElement;
    const selectedRole = target?.value as TRole;
    this.newUserRole = selectedRole;
  }

  public changeBanStatus(event: Event): void {
    const target = event.target as HTMLInputElement;
    const isBanned = target?.id === 'banUser';
    this.isBanned = isBanned;
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
    this.modalButtonText = 'Set ban status';
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
    this.errorMessage = null;
    if (this.selectedUserData !== null) {
      this._changeBanStatusSubscription = this._adminEndpointsService
        .banStatus(this.selectedUserData.id, this.isBanned)
        .subscribe({
          next: () => {
            this._notificationService.addNotification(
              `User has been ${this.isBanned ? 'banned' : 'unbanned'}!`,
              3000
            );
            this.errorMessage = null;
            this.modalVisibility = null;
            this.selectedUserData = null;
          },
          error: (error: string) => {
            this.errorMessage = error;
          },
        });
    }
  }

  public changeUserRoleFunction(): void {
    this.errorMessage = null;
    if (this.selectedUserData !== null && this.newUserRole) {
      this._changeRoleSubscription = this._adminEndpointsService
        .changeRole(this.selectedUserData.id, this.newUserRole)
        .subscribe({
          next: () => {
            this._notificationService.addNotification(
              `User role has been changed!`,
              3000
            );
            this.errorMessage = null;
            this.modalVisibility = null;
            this.selectedUserData = null;
            this.newUserRole = TRole.Student;
          },
          error: (error: string) => {
            this.errorMessage = error;
          },
        });
    }
  }

  public hideModal(): void {
    this.modalVisibility = null;
    this.selectedUserData = null;
  }

  public ngOnDestroy(): void {
    if (this._getUsersSubscription) {
      this._getUsersSubscription.unsubscribe();
    }
    if (this._changeBanStatusSubscription) {
      this._changeBanStatusSubscription.unsubscribe();
    }
    if (this._changeRoleSubscription) {
      this._changeRoleSubscription.unsubscribe();
    }
    if (this._getUserStatsSubscription) {
      this._getUserStatsSubscription.unsubscribe();
    }
  }
}
