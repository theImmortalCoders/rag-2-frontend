import { TestBed, ComponentFixture } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { CoursesSettingsComponent } from './courses-settings.component';
import { CourseEndpointsService } from '@endpoints/course-endpoints.service';
import { NotificationService } from 'app/shared/services/notification.service';
import { of, throwError } from 'rxjs';
import { HttpClientTestingModule } from '@angular/common/http/testing';

describe('CoursesSettingsComponent', () => {
  let component: CoursesSettingsComponent;
  let fixture: ComponentFixture<CoursesSettingsComponent>;
  let courseEndpointsService: jasmine.SpyObj<CourseEndpointsService>;

  beforeEach(async () => {
    const courseEndpointsServiceSpy = jasmine.createSpyObj(
      'CourseEndpointsService',
      ['getCourses', 'addCourse', 'updateCourse', 'deleteCourse']
    );
    const notificationServiceSpy = jasmine.createSpyObj('NotificationService', [
      'addNotification',
    ]);

    await TestBed.configureTestingModule({
      imports: [
        ReactiveFormsModule,
        CoursesSettingsComponent,
        HttpClientTestingModule,
      ],
      providers: [
        {
          provide: CourseEndpointsService,
          useValue: courseEndpointsServiceSpy,
        },
        { provide: NotificationService, useValue: notificationServiceSpy },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(CoursesSettingsComponent);
    component = fixture.componentInstance;
    courseEndpointsService = TestBed.inject(
      CourseEndpointsService
    ) as jasmine.SpyObj<CourseEndpointsService>;
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  describe('addNewCourseModal', () => {
    it('should set modal visibility and reset form', () => {
      component.addNewCourseModal();
      expect(component.modalVisibility).toBe('addNewCourse');
      expect(component.modalTitle).toBe('Adding new course');
      expect(component.modalButtonText).toBe('Add new course');
      expect(component.courseForm.value.newCourseName).toBe('');
    });
  });

  describe('addNewCourseFunction', () => {
    it('should call addCourse and display notification on success', () => {
      const mockCourseData = { name: 'New Course' };
      courseEndpointsService.addCourse.and.returnValue(of());

      component.courseForm.controls.newCourseName.setValue(mockCourseData.name);
      component.addNewCourseFunction();

      expect(courseEndpointsService.addCourse).toHaveBeenCalledWith(
        mockCourseData
      );
      expect(component.modalVisibility).toBeNull();
    });

    it('should set errorMessage on failure', () => {
      const mockError = 'Error adding course';
      courseEndpointsService.addCourse.and.returnValue(
        throwError(() => mockError)
      );

      component.courseForm.controls.newCourseName.setValue('New Course');
      component.addNewCourseFunction();

      expect(component.errorMessage).toBe(mockError);
    });
  });

  describe('editCourseFunction', () => {
    it('should call updateCourse and display notification on success', () => {
      const mockCourseData = { name: 'Edited Course' };
      const mockCourseId = 1;
      courseEndpointsService.updateCourse.and.returnValue(of());

      component.selectedCourseId = mockCourseId;
      component.courseForm.controls.editedCourseName.setValue(
        mockCourseData.name
      );
      component.editCourseFunction();

      expect(courseEndpointsService.updateCourse).toHaveBeenCalledWith(
        mockCourseId,
        mockCourseData
      );
      expect(component.modalVisibility).toBeNull();
    });

    it('should set errorMessage on failure', () => {
      const mockError = 'Error editing course';
      courseEndpointsService.updateCourse.and.returnValue(
        throwError(() => mockError)
      );

      component.selectedCourseId = 1;
      component.courseForm.controls.editedCourseName.setValue('Edited Course');
      component.editCourseFunction();

      expect(component.errorMessage).toBe(mockError);
    });
  });

  describe('removeCourseFunction', () => {
    it('should call deleteCourse and display notification on success', () => {
      const mockCourseId = 1;
      courseEndpointsService.deleteCourse.and.returnValue(of());

      component.selectedCourseId = mockCourseId;
      component.removeCourseFunction();

      expect(courseEndpointsService.deleteCourse).toHaveBeenCalledWith(
        mockCourseId
      );
      expect(component.modalVisibility).toBeNull();
    });

    it('should set errorMessage on failure', () => {
      const mockError = 'Error removing course';
      courseEndpointsService.deleteCourse.and.returnValue(
        throwError(() => mockError)
      );

      component.selectedCourseId = 1;
      component.removeCourseFunction();

      expect(component.errorMessage).toBe(mockError);
    });
  });

  describe('ngOnDestroy', () => {
    it('should unsubscribe from all subscriptions', () => {
      const unsubscribeSpy = spyOn(
        component['_getCoursesSubscription'],
        'unsubscribe'
      );
      component.ngOnDestroy();
      expect(unsubscribeSpy).toHaveBeenCalled();
    });
  });
});
