/* eslint-disable max-lines */
import {
  AfterViewChecked,
  Component,
  EventEmitter,
  inject,
  Input,
  OnDestroy,
  Output,
} from '@angular/core';
import * as feather from 'feather-icons';
import { AdministrationEndpointsService } from '@endpoints/administration-endpoints.service';
import { NotificationService } from 'app/shared/services/notification.service';
import { Subscription } from 'rxjs';
import { IUserResponse } from 'app/shared/models/user.models';
import { TRole } from 'app/shared/models/role.enum';
import { CommonModule } from '@angular/common';
import { AllowedRolesDirective } from '@utils/directives/allowed-roles.directive';
import { RouterLink } from '@angular/router';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-admin-settings',
  standalone: true,
  imports: [
    CommonModule,
    AllowedRolesDirective,
    RouterLink,
    ReactiveFormsModule,
  ],
  template: `
    <button
      (click)="showOptions()"
      class="flex flex-row justify-between text-xl xs:text-2xl sm:text-4xl font-bold text-mainOrange text-center 2xs:text-start">
      <span> Administration settings </span>
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
      <form
        [formGroup]="filterForm"
        (ngSubmit)="applyFilters()"
        class="w-full flex-col space-y-4 text-mainOrange pb-2">
        <div
          class="w-full flex flex-row gap-x-6 gap-y-2 flex-wrap justify-start">
          <div class="flex flex-col space-y-1 w-full xs:w-fit">
            <label for="role">Role:</label>
            <select id="role" formControlName="role" class="custom-input">
              <option value="Student">STUDENT</option>
              <option value="Teacher">TEACHER</option>
              <option value="Admin">ADMIN</option>
            </select>
          </div>
          <div class="flex flex-col space-y-1 w-full xs:w-fit">
            <label for="email">Email:</label>
            <input
              id="email"
              type="text"
              formControlName="email"
              class="custom-input"
              placeholder="Type email" />
          </div>
          <div class="flex flex-col space-y-1 w-full xs:w-fit">
            <label for="studyCycleYearA">Study Cycle Year A:</label>
            <input
              id="studyCycleYearA"
              type="number"
              formControlName="studyCycleYearA"
              class="custom-input"
              placeholder="Type year A" />
          </div>
          <div class="flex flex-col space-y-1 w-full xs:w-fit">
            <label for="studyCycleYearB">Study Cycle Year B:</label>
            <input
              id="studyCycleYearB"
              type="number"
              formControlName="studyCycleYearB"
              class="custom-input"
              placeholder="Type year B" />
          </div>
          <div class="flex flex-col space-y-1 w-full xs:w-fit">
            <label for="courseName">Course Name:</label>
            <input
              id="courseName"
              type="text"
              formControlName="courseName"
              class="custom-input"
              placeholder="Type course name" />
          </div>
          <div class="flex flex-col space-y-1 w-full xs:w-fit">
            <label for="group">Group:</label>
            <input
              id="group"
              type="text"
              formControlName="group"
              class="custom-input"
              placeholder="Type group" />
          </div>
        </div>

        <div class="w-full flex flex-row gap-x-6 flex-wrap">
          <div class="flex flex-col space-y-1 w-full xs:w-fit">
            <label for="sortDirection">Sort Direction:</label>
            <select
              id="sortDirection"
              formControlName="sortDirection"
              class="custom-input">
              <option value="Asc">ASCENDING</option>
              <option value="Desc">DESCENDING</option>
            </select>
          </div>
          <div class="flex flex-col space-y-1 w-full xs:w-fit">
            <label for="sortBy">Sort By:</label>
            <select id="sortBy" formControlName="sortBy" class="custom-input">
              <option value="Email">EMAIL</option>
              <option value="Name">NAME</option>
              <option value="StudyYearCycleA">STUDY CYCLE YEAR A</option>
              <option value="StudyYearCycleB">STUDY CYCLE YEAR B</option>
              <option value="LastPlayed">LAST PLAYED</option>
              <option value="CourseName">COURSE NAME</option>
              <option value="Group">GROUP</option>
            </select>
          </div>
        </div>
        <button
          type="submit"
          class="flex flex-row items-center justify-center gap-x-2 font-bold bg-darkGray hover:bg-mainCreme text-mainCreme hover:text-darkGray border-2 border-mainCreme rounded-md px-2 py-1 ease-in-out duration-150 transition-all">
          <i data-feather="search" class="size-4"> </i>
          <span>APPLY FILTERS</span>
        </button>
      </form>
      @if (filteredUsers && filteredUsers.length > 0) {
        <div
          class="flex flex-col min-w-[44rem] w-full justify-around space-y-0 font-mono">
          <div
            class="flex flex-row space-x-4 justify-between bg-mainGray text-mainOrange text-sm xs:text-base font-bold px-4 py-2">
            <span class="flex justify-center w-[5%]">No.</span>
            <span class="flex justify-center w-2/12">Name</span>
            <span class="flex justify-center w-2/12">Email</span>
            <span class="flex justify-center w-2/12">Role</span>
            <span class="flex justify-center w-2/12">Ban status</span>
            <span class="flex justify-center w-2/12">Check details</span>
          </div>
          @for (user of filteredUsers; track user.id) {
            <div
              class="flex flex-row space-x-4 justify-between px-4 py-2 text-mainCreme text-sm xs:text-base opacity-80 hover:opacity-100 {{
                $even ? 'bg-lightGray' : 'bg-darkGray'
              }}">
              <span class="flex justify-center w-[5%]">{{ $index + 1 }}.</span>
              <span class="flex justify-center w-2/12">{{ user.name }}</span>
              <span class="flex justify-center w-2/12">{{ user.email }}</span>
              <div
                class="flex flex-row gap-x-2 items-center justify-center w-2/12">
                <span class="uppercase">
                  {{ user.role }}
                </span>
                <button
                  *appAllowedRoles="allowedRolesAdmin"
                  (click)="
                    roleChangingId !== user.id
                      ? (roleChangingId = user.id)
                      : (roleChangingId = -1)
                  ">
                  <i
                    data-feather="settings"
                    class="size-4 hover:scale-125 hover:rotate-90 hover:text-mainOrange ease-in-out transition-transform duration-300">
                  </i>
                </button>
                <div
                  *appAllowedRoles="allowedRolesAdmin"
                  class="relative ease-in-out h-6 duration-150 transition-all {{
                    roleChangingId === user.id
                      ? 'left-0 w-fit opacity-100 z-10'
                      : '-left-32 xs:-left-16 w-0 text-nowrap opacity-0 -z-50'
                  }}">
                  <select class="custom-input-small">
                    <option value="Student">STUDENT</option>
                    <option value="Teacher">TEACHER</option>
                    <option value="Admin">ADMIN</option>
                  </select>
                </div>
              </div>
              <div
                class="flex flex-row gap-x-2 items-center justify-center w-2/12">
                <span>{{ user.banned ? 'BANNED' : 'NOT BANNED' }}</span>
                <button
                  *appAllowedRoles="allowedRolesAdmin"
                  (click)="
                    banChangingId !== user.id
                      ? (banChangingId = user.id)
                      : (banChangingId = -1)
                  ">
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
                  ban
                </div>
              </div>
              <span class="flex justify-center w-2/12">
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
      } @else {
        <span class="w-full text-mainOrange">No users found.</span>
      }
    </div>
  `,
})
export class AdminSettingsComponent implements AfterViewChecked, OnDestroy {
  @Input({ required: true }) public isOptionsVisible = false;
  @Output() public optionsVisibleEmitter = new EventEmitter<string>();

  private _adminEndpointsService = inject(AdministrationEndpointsService);
  private _notificationService = inject(NotificationService);

  private _getUsersSubscription = new Subscription();
  private _getUserStatsSubscription = new Subscription();
  private _changeBanStatusSubscription = new Subscription();
  private _changeRoleSubscription = new Subscription();

  public filterForm!: FormGroup;
  public filteredUsers: IUserResponse[] | null = null;
  public allowedRolesAdmin: TRole[] = [TRole.Admin];
  public errorMessage: string | null = null;

  public roleChangingId = -1;
  public banChangingId = -1;

  public constructor(private _fb: FormBuilder) {
    this.filterForm = this._fb.group({
      role: [TRole.Student],
      email: [''],
      studyCycleYearA: [''],
      studyCycleYearB: [''],
      group: [''],
      courseName: [''],
      sortDirection: ['Asc'],
      sortBy: ['Email'],
    });
  }

  public ngAfterViewChecked(): void {
    feather.replace(); //dodane, żeby feather-icons na nowo dodało się do DOM w pętli
  }

  public showOptions(): void {
    this.isOptionsVisible = !this.isOptionsVisible;
    if (this.isOptionsVisible) {
      this.optionsVisibleEmitter.emit('admin');
    }
  }

  public applyFilters(): void {
    const filters = this.filterForm.value;
    this._getUsersSubscription = this._adminEndpointsService
      .getUsers(
        filters.role,
        filters.email,
        filters.studyCycleYearA === null || !filters.studyCycleYearA
          ? undefined
          : filters.studyCycleYearA,
        filters.studyCycleYearB === null || !filters.studyCycleYearB
          ? undefined
          : filters.studyCycleYearB,
        filters.group,
        filters.courseName,
        filters.sortDirection,
        filters.sortBy
      )
      .subscribe({
        next: (response: IUserResponse[]) => {
          this.filteredUsers = response;
        },
        error: error => {
          this.filteredUsers = null;
          this.errorMessage = error;
        },
      });
  }

  public ngOnDestroy(): void {
    this._getUsersSubscription.unsubscribe();
    this._changeBanStatusSubscription.unsubscribe();
    this._changeRoleSubscription.unsubscribe();
    this._getUserStatsSubscription.unsubscribe();
  }
}
