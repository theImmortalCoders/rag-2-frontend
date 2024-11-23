/* eslint-disable max-lines */
import { Component, inject, OnDestroy } from '@angular/core';
import { ModalComponent } from '../../shared/modal.component';
import {
  ICourseRequest,
  ICourseResponse,
} from 'app/shared/models/course.models';
import { Subscription } from 'rxjs';
import { CourseEndpointsService } from '@endpoints/course-endpoints.service';
import {
  NonNullableFormBuilder,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { NotificationService } from 'app/shared/services/notification.service';

@Component({
  selector: 'app-courses-settings',
  standalone: true,
  imports: [ModalComponent, ReactiveFormsModule],
  template: `
    <button
      (click)="showOptions()"
      class="flex flex-row justify-between text-xl xs:text-2xl sm:text-4xl font-bold text-mainOrange text-center 2xs:text-start">
      <span> Courses settings </span>
      <div
        class="flex items-center justify-center w-fit ease-in-out duration-300 transition-all {{
          isOptionsVisible ? 'rotate-180' : 'rotate-0'
        }}">
        <i data-feather="chevron-down" class="size-8"></i>
      </div>
    </button>
    <hr class="w-full border-[1px] sm:border-2 border-mainOrange mb-4" />
    <div
      class="relative ease-in-out duration-150 transition-all {{
        isOptionsVisible
          ? 'top-0 opacity-100 z-30 h-fit'
          : '-top-16 opacity-0 -z-50 h-0'
      }}">
      <div
        class="flex flex-col xs:flex-row justify-start gap-y-2 xs:gap-y-0 space-x-0 xs:space-x-6 sm:space-x-20 w-full">
        <button
          type="button"
          (click)="addNewCourseModal()"
          class="dashboard-button group">
          <span>Add new course to system</span>
          <i data-feather="plus-square" class="dashboard-icon"></i>
        </button>
        <button
          type="button"
          (click)="editCourseModal()"
          class="dashboard-button group">
          <span>Edit existing course</span>
          <i data-feather="edit" class="dashboard-icon"></i>
        </button>
        <button
          type="button"
          (click)="removeCourseModal()"
          class="dashboard-button group">
          <span>Remove existing course</span>
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
              [formGroup]="courseForm"
              class="flex flex-col space-y-4 w-full text-sm sm:text-base">
              @if (modalVisibility === 'addNewCourse') {
                <div class="flex flex-col space-y-1">
                  <label for="newCourseName" class="text-start"
                    >Course name</label
                  >
                  <input
                    id="newCourseName"
                    type="text"
                    formControlName="newCourseName"
                    placeholder="Type new course name"
                    class="custom-input" />
                </div>
              } @else if (
                (modalVisibility === 'editCourse' ||
                  modalVisibility === 'removeCourse') &&
                courseList !== null
              ) {
                <select
                  id="selectedGameId"
                  class="custom-input"
                  (change)="setSelectedCourseId($event)">
                  <option value="0">Choose existing course</option>
                  @for (course of courseList; track course.id) {
                    <option [value]="course.id">{{ course.name }}</option>
                  }
                </select>
              }
              @if (modalVisibility === 'editCourse') {
                <div class="flex flex-col space-y-1">
                  <label for="editedCourseName" class="text-start"
                    >Edited course name</label
                  >
                  <input
                    id="editedCourseName"
                    type="text"
                    formControlName="editedCourseName"
                    placeholder="Type edited course name"
                    class="custom-input" />
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
export class CoursesSettingsComponent implements OnDestroy {
  private _courseEndpointsService = inject(CourseEndpointsService);
  private _notificationService = inject(NotificationService);
  private _formBuilder = inject(NonNullableFormBuilder);

  private _getCoursesSubscription = new Subscription();
  private _addCourseSubscription = new Subscription();
  private _editCourseSubscription = new Subscription();
  private _removeCourseSubscription = new Subscription();

  public courseList: ICourseResponse[] | null = null;

  public selectedCourseId = 0;
  public errorMessage: string | null = null;
  public isOptionsVisible = false;

  public modalVisibility:
    | 'addNewCourse'
    | 'editCourse'
    | 'removeCourse'
    | null = null;
  public modalTitle = '';
  public modalButtonText = '';
  public modalButtonFunction!: () => void;

  public courseForm = this._formBuilder.group({
    newCourseName: ['', [Validators.required]],
    editedCourseName: ['', [Validators.required]],
  });

  public showOptions(): void {
    this.isOptionsVisible = !this.isOptionsVisible;
  }

  public setSelectedCourseId(event: Event): void {
    const target = event.target as HTMLSelectElement;
    const selectedId = target?.value;
    this.selectedCourseId = parseInt(selectedId, 10);
    const selectedCourse = this.courseList?.find(
      course => course.id === this.selectedCourseId
    );
    const selectedCourseName = selectedCourse ? selectedCourse.name : '';
    this.courseForm.controls.editedCourseName.setValue(selectedCourseName);
  }

  public getCourseList(): void {
    this._getCoursesSubscription = this._courseEndpointsService
      .getCourses()
      .subscribe({
        next: (response: ICourseResponse[]) => {
          this.courseList = response;
        },
      });
  }

  public addNewCourseModal(): void {
    this.modalVisibility = 'addNewCourse';
    this.modalTitle = 'Adding new course';
    this.modalButtonText = 'Add new course';
    this.modalButtonFunction = this.addNewCourseFunction;
    this.errorMessage = null;
    this.courseForm.reset();
  }

  public editCourseModal(): void {
    this.modalVisibility = 'editCourse';
    this.modalTitle = 'Editing existing course';
    this.modalButtonText = 'Edit course name';
    this.modalButtonFunction = this.editCourseFunction;
    this.errorMessage = null;
    this.getCourseList();
    this.courseForm.reset();
  }

  public removeCourseModal(): void {
    this.modalVisibility = 'removeCourse';
    this.modalTitle = 'Removing existing course';
    this.modalButtonText = 'Remove course';
    this.modalButtonFunction = this.removeCourseFunction;
    this.errorMessage = null;
    this.getCourseList();
  }

  public hideModal(): void {
    this.modalVisibility = null;
  }

  public addNewCourseFunction(): void {
    this.errorMessage = null;
    if (this.courseForm.value.newCourseName) {
      const formValues = this.courseForm.value;
      if (formValues.newCourseName) {
        const courseData: ICourseRequest = {
          name: formValues.newCourseName,
        };
        this._addCourseSubscription = this._courseEndpointsService
          .addCourse(courseData)
          .subscribe({
            next: () => {
              this._notificationService.addNotification(
                'New course has been added!',
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

  public editCourseFunction(): void {
    this.errorMessage = null;
    if (this.courseForm.value.editedCourseName && this.selectedCourseId !== 0) {
      const formValues = this.courseForm.value;
      if (formValues.editedCourseName) {
        const courseData: ICourseRequest = {
          name: formValues.editedCourseName,
        };
        this._editCourseSubscription = this._courseEndpointsService
          .updateCourse(this.selectedCourseId, courseData)
          .subscribe({
            next: () => {
              this._notificationService.addNotification(
                'Existing course has been edited!',
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

  public removeCourseFunction(): void {
    this.errorMessage = null;
    if (this.selectedCourseId !== 0) {
      this._removeCourseSubscription = this._courseEndpointsService
        .deleteCourse(this.selectedCourseId)
        .subscribe({
          next: () => {
            this._notificationService.addNotification(
              'Existing course has been deleted!',
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
    this._getCoursesSubscription.unsubscribe();
    this._addCourseSubscription.unsubscribe();
    this._editCourseSubscription.unsubscribe();
    this._removeCourseSubscription.unsubscribe();
  }
}
