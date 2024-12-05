/* eslint-disable max-lines */
import {
  Component,
  EventEmitter,
  inject,
  Input,
  OnChanges,
  OnDestroy,
  Output,
  SimpleChanges,
} from '@angular/core';
import { RouterLink } from '@angular/router';
import { AdministrationEndpointsService } from '@endpoints/administration-endpoints.service';
import { AllowedRolesDirective } from '@utils/directives/allowed-roles.directive';
import { TRole } from 'app/shared/models/role.enum';
import { IUserResponse } from 'app/shared/models/endpoints/user.models';
import { NotificationService } from 'app/shared/services/notification.service';
import { Subscription } from 'rxjs';
import { LoadingSpinnerComponent } from '../../../../shared/components/common/loading-spinner.component';

@Component({
  selector: 'app-user-table',
  standalone: true,
  imports: [RouterLink, AllowedRolesDirective, LoadingSpinnerComponent],
  template: `
    @if (isLoading) {
      <app-loading-spinner />
    } @else {
      @if (filteredUsers && filteredUsers.length > 0) {
        <div class="w-full overflow-auto max-h-96 border-mainOrange border-2">
          <div
            class="flex flex-col min-w-[66rem] w-full justify-around space-y-0 font-mono">
            <div
              class="flex flex-row space-x-4 justify-between bg-mainGray text-mainOrange text-sm xs:text-base font-bold px-4 py-2">
              <span class="flex items-center justify-center w-[5%]">No.</span>
              <div
                class="flex flex-row gap-x-1 items-center justify-center w-2/12">
                <button (click)="setSortingBy('Email')">Email</button>
                @if (sortBy === 'Email') {
                  <span
                    class="ease-in-out duration-150 transition-all {{
                      sortDirection === 'Desc' ? 'rotate-180' : ''
                    }}">
                    <i data-feather="chevron-down" class="size-4 "></i>
                  </span>
                } @else {
                  <span>
                    <i data-feather="minus" class="size-4 "></i>
                  </span>
                }
              </div>
              <div
                class="flex flex-row gap-x-1 items-center justify-center w-[10%]">
                <button (click)="setSortingBy('StudyYearCycleA')">
                  Cycle years
                </button>
                @if (sortBy === 'StudyYearCycleA') {
                  <span
                    class="ease-in-out duration-150 transition-all {{
                      sortDirection === 'Desc' ? 'rotate-180' : ''
                    }}">
                    <i data-feather="chevron-down" class="size-4 "></i>
                  </span>
                } @else {
                  <span>
                    <i data-feather="minus" class="size-4 "></i>
                  </span>
                }
              </div>
              <div
                class="flex flex-row gap-x-1 items-center justify-center w-[7%]">
                <button (click)="setSortingBy('CourseName')">Course</button>
                @if (sortBy === 'CourseName') {
                  <span
                    class="ease-in-out duration-150 transition-all {{
                      sortDirection === 'Desc' ? 'rotate-180' : ''
                    }}">
                    <i data-feather="chevron-down" class="size-4 "></i>
                  </span>
                } @else {
                  <span>
                    <i data-feather="minus" class="size-4 "></i>
                  </span>
                }
              </div>
              <div
                class="flex flex-row gap-x-1 items-center justify-center w-[7%]">
                <button (click)="setSortingBy('Group')">Group</button>
                @if (sortBy === 'Group') {
                  <span
                    class="ease-in-out duration-150 transition-all {{
                      sortDirection === 'Desc' ? 'rotate-180' : ''
                    }}">
                    <i data-feather="chevron-down" class="size-4 "></i>
                  </span>
                } @else {
                  <span>
                    <i data-feather="minus" class="size-4 "></i>
                  </span>
                }
              </div>
              <span class="flex items-center justify-center w-2/12">Role</span>
              <span class="flex items-center justify-center w-2/12"
                >Ban status</span
              >
              <span class="flex items-center justify-center w-[5%]"
                >Details</span
              >
            </div>
            @for (user of filteredUsers; track user.id) {
              <div
                class="flex flex-row space-x-4 justify-between px-4 py-2 text-mainCreme text-sm xs:text-base opacity-80 hover:opacity-100 {{
                  $even ? 'bg-lightGray' : 'bg-darkGray'
                }}">
                <span class="flex justify-center w-[5%]"
                  >{{ $index + 1 }}.</span
                >
                <span class="flex justify-center w-2/12">{{ user.email }}</span>
                <span class="flex justify-center w-[10%]"
                  >{{ user.studyCycleYearA }}/{{ user.studyCycleYearB }}</span
                >
                <span class="flex justify-center w-[7%]">{{
                  user?.course?.name
                }}</span>
                <span class="flex justify-center w-[7%]">{{ user.group }}</span>
                <div
                  class="flex flex-row gap-x-2 items-center justify-center w-2/12">
                  <span class="uppercase">
                    {{ user.role }}
                  </span>
                  <button
                    *appAllowedRoles="allowedRolesAdmin"
                    (click)="setNewRoleUserId(user.id)">
                    <i
                      data-feather="settings"
                      class="size-4 hover:scale-125 hover:rotate-90 hover:text-mainOrange ease-in-out transition-transform duration-300">
                    </i>
                  </button>
                  <div
                    *appAllowedRoles="allowedRolesAdmin"
                    class="flex flex-row gap-x-2 relative ease-in-out h-6 duration-150 transition-all {{
                      roleChangingId === user.id
                        ? 'left-0 w-fit opacity-100 z-10'
                        : '-left-32 xs:-left-16 w-0 text-nowrap opacity-0 -z-50'
                    }}">
                    <select
                      #roleChange
                      (change)="setNewRole(roleChange.value)"
                      [value]="newUserRole"
                      class="custom-input-small">
                      <option value="Student">STUDENT</option>
                      <option value="Teacher">TEACHER</option>
                      <option value="Admin">ADMIN</option>
                    </select>
                    <button
                      (click)="changeRole()"
                      class="text-mainOrange px-1 border-[1px] border-mainOrange rounded-md hover:bg-mainOrange hover:text-darkGray">
                      SET
                    </button>
                  </div>
                </div>
                <div
                  class="flex flex-row gap-x-2 items-center justify-center w-2/12">
                  <span>{{ user.banned ? 'BANNED' : 'NOT BANNED' }}</span>
                  <button
                    *appAllowedRoles="allowedRolesAdmin"
                    (click)="setBanUserId(user.id)">
                    <i
                      data-feather="settings"
                      class="size-4 hover:scale-125 hover:rotate-90 hover:text-mainOrange ease-in-out transition-transform duration-300">
                    </i>
                  </button>
                  <div
                    *appAllowedRoles="allowedRolesAdmin"
                    class="relative ease-in-out h-6 duration-150 transition-all {{
                      banChangingId === user.id
                        ? 'left-0 w-fit opacity-100 z-10'
                        : '-left-32 xs:-left-16 w-0 text-nowrap opacity-0 -z-50'
                    }}">
                    <button
                      (click)="changeBanStatus(!user.banned)"
                      class="text-mainOrange px-1 border-[1px] border-mainOrange rounded-md hover:bg-mainOrange hover:text-darkGray">
                      {{ user.banned ? 'UNBAN' : 'BAN' }}
                    </button>
                  </div>
                </div>
                <span class="flex justify-center w-[5%]">
                  <a
                    [routerLink]="['/dashboard/user', user.id]"
                    target="_blank"
                    class="hover:text-mainOrange ease-in-out duration-150 transition-all">
                    <i data-feather="external-link" class="size-5"></i>
                  </a>
                </span>
              </div>
            }
          </div>
        </div>
      } @else {
        <span class="w-full text-mainOrange">No users found.</span>
      }
    }
    <div class="text-red-500 mt-6 text-sm sm:text-base">
      @if (errorMessage !== null) {
        <p>{{ errorMessage }}</p>
      }
    </div>
  `,
})
export class UserTableComponent implements OnChanges, OnDestroy {
  @Input({ required: true }) public filteredUsers: IUserResponse[] | null =
    null;
  @Input({ required: true }) public isLoading = false;
  @Output() public sortByEmitter = new EventEmitter<
    | 'Id'
    | 'Email'
    | 'Name'
    | 'StudyYearCycleA'
    | 'StudyYearCycleB'
    | 'LastPlayed'
    | 'CourseName'
    | 'Group'
  >();
  @Output() public sortDirectionEmitter = new EventEmitter<'Asc' | 'Desc'>();
  @Output() public refreshUserTableEmitter = new EventEmitter<boolean>();

  private _adminEndpointsService = inject(AdministrationEndpointsService);
  private _notificationService = inject(NotificationService);

  private _changeRoleSubscription = new Subscription();
  private _changeBanStatusSubscription = new Subscription();

  public allowedRolesAdmin: TRole[] = [TRole.Admin];
  public errorMessage: string | null = null;

  public sortBy:
    | 'Id'
    | 'Email'
    | 'Name'
    | 'StudyYearCycleA'
    | 'StudyYearCycleB'
    | 'LastPlayed'
    | 'CourseName'
    | 'Group' = 'Email';
  public sortDirection: 'Asc' | 'Desc' = 'Asc';

  public roleChangingId = -1;
  public newUserRole = TRole.Student;
  public banChangingId = -1;

  public ngOnChanges(): void {
    this.errorMessage = null;
  }

  public setSortingBy(
    value:
      | 'Id'
      | 'Email'
      | 'Name'
      | 'StudyYearCycleA'
      | 'StudyYearCycleB'
      | 'LastPlayed'
      | 'CourseName'
      | 'Group'
  ): void {
    if (this.sortBy === value && this.sortDirection === 'Asc') {
      this.sortDirection = 'Desc';
    } else {
      this.sortDirection = 'Asc';
    }
    this.sortBy = value;
    this.sortByEmitter.emit(this.sortBy);
    this.sortDirectionEmitter.emit(this.sortDirection);
  }

  public setNewRoleUserId(id: number): void {
    if (this.roleChangingId !== id) {
      this.roleChangingId = id;
    } else {
      this.roleChangingId = -1;
    }
    this.newUserRole = TRole.Student;
  }

  public setBanUserId(id: number): void {
    if (this.banChangingId !== id) {
      this.banChangingId = id;
    } else {
      this.banChangingId = -1;
    }
  }

  public setNewRole(role: string): void {
    this.newUserRole = role as TRole;
  }

  public changeRole(): void {
    this.errorMessage = null;
    this._changeRoleSubscription = this._adminEndpointsService
      .changeRole(this.roleChangingId, this.newUserRole)
      .subscribe({
        next: () => {
          this._notificationService.addNotification(
            `User role has been changed!`,
            3000
          );
          this.errorMessage = null;
          this.newUserRole = TRole.Student;
          this.roleChangingId = -1;
          this.refreshUserTableEmitter.emit(true);
        },
        error: (error: string) => {
          this.errorMessage = error;
        },
      });
  }

  public changeBanStatus(needBan: boolean): void {
    this.errorMessage = null;
    this._changeBanStatusSubscription = this._adminEndpointsService
      .banStatus(this.banChangingId, needBan)
      .subscribe({
        next: () => {
          this._notificationService.addNotification(
            `User has been ${needBan ? 'banned' : 'unbanned'}!`,
            3000
          );
          this.errorMessage = null;
          this.banChangingId = -1;
          this.refreshUserTableEmitter.emit(true);
        },
        error: (error: string) => {
          this.errorMessage = error;
        },
      });
  }

  public ngOnDestroy(): void {
    this._changeBanStatusSubscription.unsubscribe();
    this._changeRoleSubscription.unsubscribe();
  }
}
