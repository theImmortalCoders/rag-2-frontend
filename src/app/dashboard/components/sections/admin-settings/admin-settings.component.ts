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
import { Subscription } from 'rxjs';
import { IUserResponse } from 'app/shared/models/user.models';
import { TRole } from 'app/shared/models/role.enum';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { UserTableComponent } from '../../shared/user-table.component';

@Component({
  selector: 'app-admin-settings',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, UserTableComponent],
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
      <app-user-table [filteredUsers]="filteredUsers" />
      <div class="text-red-500 mt-6 text-sm sm:text-base">
        @if (errorMessage !== null) {
          <p>{{ errorMessage }}</p>
        }
      </div>
    </div>
  `,
})
export class AdminSettingsComponent implements AfterViewChecked, OnDestroy {
  @Input({ required: true }) public isOptionsVisible = false;
  @Output() public optionsVisibleEmitter = new EventEmitter<string>();

  private _adminEndpointsService = inject(AdministrationEndpointsService);

  private _getUsersSubscription = new Subscription();
  public filterForm!: FormGroup;
  public filteredUsers: IUserResponse[] | null = null;
  public errorMessage: string | null = null;

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
  }
}
