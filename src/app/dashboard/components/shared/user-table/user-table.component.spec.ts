import { ComponentFixture, TestBed } from '@angular/core/testing';
import { UserTableComponent } from './user-table.component';
import { AdministrationEndpointsService } from '@endpoints/administration-endpoints.service';
import { throwError } from 'rxjs';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';

describe('UserTableComponent', () => {
  let component: UserTableComponent;
  let fixture: ComponentFixture<UserTableComponent>;
  let mockAdminEndpointsService: jasmine.SpyObj<AdministrationEndpointsService>;

  beforeEach(async () => {
    mockAdminEndpointsService = jasmine.createSpyObj(
      'AdministrationEndpointsService',
      ['changeRole', 'banStatus']
    );

    await TestBed.configureTestingModule({
      imports: [
        UserTableComponent,
        HttpClientTestingModule,
        RouterTestingModule,
      ],
      providers: [
        {
          provide: AdministrationEndpointsService,
          useValue: mockAdminEndpointsService,
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(UserTableComponent);
    component = fixture.componentInstance;
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  describe('setSortingBy', () => {
    it('should toggle sort direction when the same field is clicked', () => {
      component.sortBy = 'Email';
      component.sortDirection = 'Asc';
      component.setSortingBy('Email');
      expect(component.sortDirection).toBe('Desc');
    });

    it('should reset sort direction to Asc when a new field is clicked', () => {
      component.sortBy = 'Email';
      component.sortDirection = 'Desc';
      component.setSortingBy('StudyYearCycleA');
      expect(component.sortBy).toBe('StudyYearCycleA');
      expect(component.sortDirection).toBe('Asc');
    });

    it('should emit the sortBy and sortDirection values', () => {
      spyOn(component.sortByEmitter, 'emit');
      spyOn(component.sortDirectionEmitter, 'emit');
      component.setSortingBy('Group');
      expect(component.sortByEmitter.emit).toHaveBeenCalledWith('Group');
      expect(component.sortDirectionEmitter.emit).toHaveBeenCalledWith('Asc');
    });
  });

  describe('changeRole', () => {
    it('should set errorMessage on failure', () => {
      mockAdminEndpointsService.changeRole.and.returnValue(
        throwError(() => 'Error changing role')
      );

      component.changeRole();

      expect(component.errorMessage).toBe('Error changing role');
      expect(component.roleChangingId).toBe(-1);
    });
  });

  describe('changeBanStatus', () => {
    it('should set errorMessage on failure', () => {
      mockAdminEndpointsService.banStatus.and.returnValue(
        throwError(() => 'Error changing ban status')
      );

      component.changeBanStatus(false);

      expect(component.errorMessage).toBe('Error changing ban status');
      expect(component.banChangingId).toBe(-1);
    });
  });

  describe('ngOnDestroy', () => {
    it('should unsubscribe from subscriptions', () => {
      const changeRoleSpy = spyOn(
        component['_changeRoleSubscription'],
        'unsubscribe'
      );
      const changeBanSpy = spyOn(
        component['_changeBanStatusSubscription'],
        'unsubscribe'
      );

      component.ngOnDestroy();

      expect(changeRoleSpy).toHaveBeenCalled();
      expect(changeBanSpy).toHaveBeenCalled();
    });
  });

  describe('UI rendering', () => {
    it('should display "No users found" when filteredUsers is null or empty', () => {
      component.filteredUsers = null;
      fixture.detectChanges();

      const noUsersElement = fixture.nativeElement.querySelector('span');
      expect(noUsersElement.textContent).toContain('No users found');
    });
  });
});
