import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AdminSettingsComponent } from './admin-settings.component';
import { AdministrationEndpointsService } from '@endpoints/administration-endpoints.service';
import { NotificationService } from 'app/shared/services/notification.service';
import { of, throwError } from 'rxjs';
import { IUserResponse } from 'app/shared/models/user.models';
import { TRole } from 'app/shared/models/role.enum';
import { HttpClientTestingModule } from '@angular/common/http/testing';

describe('AdminSettingsComponent', () => {
  let component: AdminSettingsComponent;
  let fixture: ComponentFixture<AdminSettingsComponent>;
  let adminServiceSpy: jasmine.SpyObj<AdministrationEndpointsService>;

  const mockUser: IUserResponse = {
    id: 1,
    name: 'John Doe',
    email: 'john.doe@example.com',
    role: 'Student' as TRole,
    studyCycleYearA: 1,
    studyCycleYearB: 2,
    banned: false,
    lastPlayed: '',
    course: { id: 1, name: '' },
    group: 'l1',
  };

  beforeEach(async () => {
    const adminSpy = jasmine.createSpyObj('AdministrationEndpointsService', [
      'getUsers',
      'banStatus',
      'changeRole',
    ]);
    const notificationSpy = jasmine.createSpyObj('NotificationService', [
      'addNotification',
    ]);

    await TestBed.configureTestingModule({
      imports: [AdminSettingsComponent, HttpClientTestingModule],
      providers: [
        { provide: AdministrationEndpointsService, useValue: adminSpy },
        { provide: NotificationService, useValue: notificationSpy },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(AdminSettingsComponent);
    component = fixture.componentInstance;

    adminServiceSpy = TestBed.inject(
      AdministrationEndpointsService
    ) as jasmine.SpyObj<AdministrationEndpointsService>;

    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should load users list when banUnbanUserModal is called', () => {
    adminServiceSpy.getUsers.and.returnValue(of([mockUser]));
    component.banUnbanUserModal();
    expect(adminServiceSpy.getUsers).toHaveBeenCalled();
    expect(component.modalVisibility).toBe('banUnbanUser');
    expect(component.modalTitle).toBe('Changing ban status of user');
    expect(component.modalButtonText).toBe('Set ban status');
    expect(component.usersList).toEqual([mockUser]);
  });

  it('should update ban status and show notification', () => {
    component.selectedUserData = mockUser;
    component.isBanned = true;
    adminServiceSpy.banStatus.and.returnValue(of());

    component.banUnbanUserFunction();
    expect(adminServiceSpy.banStatus).toHaveBeenCalledWith(mockUser.id, true);
    expect(component.modalVisibility).toBeNull();
  });

  it('should display an error message if changing ban status fails', () => {
    adminServiceSpy.banStatus.and.returnValue(
      throwError('Error changing status')
    );
    component.selectedUserData = mockUser;
    component.isBanned = true;

    component.banUnbanUserFunction();
    expect(component.errorMessage).toBe('Error changing status');
  });

  it('should update user role and show notification', () => {
    component.selectedUserData = mockUser;
    component.newUserRole = TRole.Admin;
    adminServiceSpy.changeRole.and.returnValue(of());

    component.changeUserRoleFunction();
    expect(adminServiceSpy.changeRole).toHaveBeenCalledWith(
      mockUser.id,
      TRole.Admin
    );
    expect(component.modalVisibility).toBeNull();
  });

  it('should set error message if role change fails', () => {
    adminServiceSpy.changeRole.and.returnValue(
      throwError('Error changing role')
    );
    component.selectedUserData = mockUser;
    component.newUserRole = TRole.Admin;

    component.changeUserRoleFunction();
    expect(component.errorMessage).toBe('Error changing role');
  });

  it('should hide modal and reset selected user data when hideModal is called', () => {
    component.modalVisibility = 'banUnbanUser';
    component.selectedUserData = mockUser;

    component.hideModal();
    expect(component.modalVisibility).toBeNull();
    expect(component.selectedUserData).toBeNull();
  });

  it('should unsubscribe from all subscriptions on component destroy', () => {
    const subscriptionSpy = jasmine.createSpyObj('Subscription', [
      'unsubscribe',
    ]);
    component['_getUsersSubscription'] = subscriptionSpy;
    component['_getUserStatsSubscription'] = subscriptionSpy;
    component['_changeBanStatusSubscription'] = subscriptionSpy;
    component['_changeRoleSubscription'] = subscriptionSpy;

    component.ngOnDestroy();
    expect(subscriptionSpy.unsubscribe).toHaveBeenCalledTimes(4);
  });
});
