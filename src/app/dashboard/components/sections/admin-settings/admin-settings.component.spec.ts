import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { of, throwError } from 'rxjs';
import { AdminSettingsComponent } from './admin-settings.component';
import { AdministrationEndpointsService } from '@endpoints/administration-endpoints.service';
import { IUserResponse } from 'app/shared/models/endpoints/user.models';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { TRole } from 'app/shared/models/role.enum';

describe('AdminSettingsComponent', () => {
  let component: AdminSettingsComponent;
  let fixture: ComponentFixture<AdminSettingsComponent>;
  let mockAdminEndpointsService: jasmine.SpyObj<AdministrationEndpointsService>;

  beforeEach(async () => {
    mockAdminEndpointsService = jasmine.createSpyObj(
      'AdministrationEndpointsService',
      ['getUsers']
    );

    await TestBed.configureTestingModule({
      imports: [
        AdminSettingsComponent,
        ReactiveFormsModule,
        HttpClientTestingModule,
      ],
      providers: [
        {
          provide: AdministrationEndpointsService,
          useValue: mockAdminEndpointsService,
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(AdminSettingsComponent);
    component = fixture.componentInstance;

    // Mock the subscription response
    mockAdminEndpointsService.getUsers.and.returnValue(of([]));
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('ngOnInit', () => {
    it('should initialize with users fetched', () => {
      const mockUsers: IUserResponse[] = [
        { id: 1, email: 'test@example.com' } as IUserResponse,
      ];
      mockAdminEndpointsService.getUsers.and.returnValue(of(mockUsers));

      component.ngOnInit();

      expect(mockAdminEndpointsService.getUsers).toHaveBeenCalled();
      expect(component.filteredUsers).toEqual(mockUsers);
      expect(component.errorMessage).toBeNull();
    });

    it('should handle error when fetching users', () => {
      const errorMessage = 'Error fetching users';
      mockAdminEndpointsService.getUsers.and.returnValue(
        throwError(() => errorMessage)
      );

      component.ngOnInit();

      expect(mockAdminEndpointsService.getUsers).toHaveBeenCalled();
      expect(component.filteredUsers).toBeNull();
      expect(component.errorMessage).toEqual(errorMessage);
    });
  });

  describe('showOptions', () => {
    it('should toggle isOptionsVisible and emit the event if visible', () => {
      spyOn(component.optionsVisibleEmitter, 'emit');

      component.showOptions();
      expect(component.isOptionsVisible).toBeTrue();
      expect(component.optionsVisibleEmitter.emit).toHaveBeenCalledWith(
        'admin'
      );

      component.showOptions();
      expect(component.isOptionsVisible).toBeFalse();
    });
  });

  describe('applyFilters', () => {
    it('should apply filters and fetch filtered users', () => {
      const mockUsers: IUserResponse[] = [
        { id: 2, email: 'filtered@example.com' } as IUserResponse,
      ];
      mockAdminEndpointsService.getUsers.and.returnValue(of(mockUsers));

      component.filterForm.setValue({
        role: 'Student',
        email: 'test@example.com',
        studyCycleYearA: null,
        studyCycleYearB: null,
        group: '',
        courseName: '',
      });

      component.applyFilters();

      expect(mockAdminEndpointsService.getUsers).toHaveBeenCalledWith(
        'Student' as TRole,
        'test@example.com',
        undefined,
        undefined,
        '',
        '',
        'Asc',
        'Email'
      );
      expect(component.filteredUsers).toEqual(mockUsers);
      expect(component.errorMessage).toBeNull();
    });

    it('should handle error when applying filters', () => {
      const errorMessage = 'Error applying filters';
      mockAdminEndpointsService.getUsers.and.returnValue(
        throwError(() => errorMessage)
      );

      component.applyFilters();

      expect(mockAdminEndpointsService.getUsers).toHaveBeenCalled();
      expect(component.filteredUsers).toBeNull();
      expect(component.errorMessage).toEqual(errorMessage);
    });
  });

  describe('ngOnDestroy', () => {
    it('should unsubscribe from getUsersSubscription', () => {
      spyOn(component['_getUsersSubscription'], 'unsubscribe');

      component.ngOnDestroy();

      expect(component['_getUsersSubscription'].unsubscribe).toHaveBeenCalled();
    });
  });
});
