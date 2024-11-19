/* eslint-disable max-lines */
import { Component, inject, OnDestroy } from '@angular/core';
import { ModalComponent } from '../../shared/modal.component';
import { AdministrationEndpointsService } from '@endpoints/administration-endpoints.service';
import { NotificationService } from 'app/shared/services/notification.service';
import { Subscription } from 'rxjs';
import { IUserResponse } from 'app/shared/models/user.models';
import { TRole } from 'app/shared/models/role.enum';
import { CommonModule } from '@angular/common';
import { AllowedRolesDirective } from '@utils/directives/allowed-roles.directive';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-admin-settings',
  standalone: true,
  imports: [ModalComponent, CommonModule, AllowedRolesDirective, RouterLink],
  template: `
    <h1
      class="text-xl xs:text-2xl sm:text-4xl font-bold text-mainOrange text-center 2xs:text-start">
      Administration settings
    </h1>
    <hr class="w-full border-[1px] sm:border-2 border-mainOrange mb-4" />
    <div
      class="flex flex-col xs:flex-row justify-between gap-y-2 xs:gap-y-0 space-x-0 xs:space-x-4 sm:space-x-8 w-full">
      <button
        type="button"
        *appAllowedRoles="allowedRolesAdmin"
        (click)="banUnbanUserModal()"
        class="dashboard-button group">
        <span>Ban/unban some user</span>
        <i data-feather="slash" class="dashboard-icon"></i>
      </button>
      <button
        type="button"
        *appAllowedRoles="allowedRolesAdmin"
        (click)="changeUserRoleModal()"
        class="dashboard-button group">
        <span>Change role of some user</span>
        <i data-feather="edit" class="dashboard-icon"></i>
      </button>
      <button
        type="button"
        (click)="getUserDetailsModal()"
        class="dashboard-button group">
        <span>Get details of some user</span>
        <i data-feather="eye" class="dashboard-icon"></i>
      </button>
    </div>
    @if (modalVisibility !== null) {
      <app-modal (closeModal)="hideModal()">
        <div class="flex flex-col items-start w-full font-mono">
          <h2
            class="text-2xl sm:text-3xl text-mainCreme font-bold mb-2 xs:mb-6 sm:mb-10">
            {{ modalTitle }}
          </h2>
          <div class="flex flex-col space-y-4 w-full text-sm sm:text-base">
            <select class="custom-input" (change)="setSelectedUser($event)">
              <option value="0">Choose one user</option>
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
            <div
              class="flex flex-row w-full justify-around pt-4 text-sm sm:text-base">
              <label
                for="banUser"
                class="custom-input-red min-w-fit w-1/4 text-center flex flex-row"
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
                class="custom-input-green min-w-fit w-1/4 text-center flex flex-row"
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
            <div class="flex flex-row pt-4 text-sm sm:text-base">
              <span>Current user role:&nbsp;</span>
              <span class="text-mainOrange font-extrabold uppercase">{{
                selectedUserData.role
              }}</span>
            </div>
            <div class="flex flex-row pt-4 text-sm sm:text-base">
              <span>Choose new role:&nbsp;</span>
              <select class="custom-input" (click)="setNewUserRole($event)">
                <option value="Student">Student</option>
                <option value="Teacher">Teacher</option>
                <option value="Admin">Admin</option>
              </select>
            </div>
          } @else if (
            modalVisibility === 'getUserDetails' && selectedUserData !== null
          ) {
            <a
              [routerLink]="['/dashboard/user', selectedUserData.id]"
              class="flex flex-row w-full items-center justify-center group space-x-2 rounded-lg mt-1 xs:mt-2 px-2 xs:px-3 py-1 xs:py-2 bg-mainGray text-mainOrange border-2 border-mainOrange transition-all ease-in-out hover:bg-mainOrange hover:text-mainGray text-base">
              Check user details
            </a>
          }
          @if (modalButtonText !== null) {
            <button
              class="flex flex-row w-full items-center justify-center group space-x-2 rounded-lg mt-4 xs:mt-6 px-2 xs:px-3 py-1 xs:py-2 bg-mainGray text-mainOrange border-2 border-mainOrange transition-all ease-in-out hover:bg-mainOrange hover:text-mainGray text-base"
              (click)="modalButtonFunction()">
              {{ modalButtonText }}
            </button>
          }
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
  `,
})
export class AdminSettingsComponent implements OnDestroy {
  private _adminEndpointsService = inject(AdministrationEndpointsService);
  private _notificationService = inject(NotificationService);

  private _getUsersSubscription = new Subscription();
  private _getUserStatsSubscription = new Subscription();
  private _changeBanStatusSubscription = new Subscription();
  private _changeRoleSubscription = new Subscription();

  public usersList: IUserResponse[] | null = null;
  public selectedUserData: IUserResponse | null = null;
  public isBanned = false;
  public newUserRole: TRole = TRole.Student;
  public errorMessage: string | null = null;
  public allowedRolesAdmin: TRole[] = [TRole.Admin];

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
    if (this.usersList && selectedId !== 0) {
      this.usersList.map(user => {
        if (user.id === selectedId) {
          this.isBanned = user.banned;
          this.selectedUserData = user;
        }
      });
    } else {
      this.selectedUserData = null;
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
    this._getUsersSubscription.unsubscribe();
    this._changeBanStatusSubscription.unsubscribe();
    this._changeRoleSubscription.unsubscribe();
    this._getUserStatsSubscription.unsubscribe();
  }
}
