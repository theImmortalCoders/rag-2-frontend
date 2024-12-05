import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DashboardPageComponent } from './dashboard.page.component';
import { StatsEndpointsService } from '@endpoints/stats-endpoints.service';
import { of, throwError } from 'rxjs';
import { IUserResponse, IUserStatsResponse } from '@api-models/user.models';
import { TRole } from 'app/shared/models/role.enum';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { AuthEndpointsService } from '@endpoints/auth-endpoints.service';

describe('DashboardPageComponent', () => {
  let component: DashboardPageComponent;
  let fixture: ComponentFixture<DashboardPageComponent>;
  let statsEndpointsService: jasmine.SpyObj<StatsEndpointsService>;
  let authEndpointsService: jasmine.SpyObj<AuthEndpointsService>;

  beforeEach(async () => {
    statsEndpointsService = jasmine.createSpyObj('StatsEndpointsService', [
      'getUserStats',
    ]);
    authEndpointsService = jasmine.createSpyObj('StatsEndpointsService', [
      'verifyJWTToken',
      'getMe',
      'logout',
    ]);

    authEndpointsService.verifyJWTToken.and.returnValue(of(true));

    await TestBed.configureTestingModule({
      imports: [DashboardPageComponent, HttpClientTestingModule],
      providers: [
        { provide: StatsEndpointsService, useValue: statsEndpointsService },
        { provide: AuthEndpointsService, useValue: authEndpointsService },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(DashboardPageComponent);
    component = fixture.componentInstance;
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  describe('ngOnInit', () => {
    it('should subscribe to getMe and set aboutMeUserInfo and call getUserStats', () => {
      const userResponse: IUserResponse = {
        id: 1,
        email: 'john.doe@example.com',
        role: TRole.Admin,
        name: 'John Doe',
        studyCycleYearA: 2022,
        studyCycleYearB: 2023,
        lastPlayed: '2024-10-31',
        banned: false,
        course: { id: 1, name: '' },
        group: 'l1',
      };

      authEndpointsService.getMe.and.returnValue(of(userResponse));

      const userStatsResponse: IUserStatsResponse = {
        games: 15,
        plays: 30,
        totalStorageMb: 512,
        firstPlayed: '2023-01-01',
        lastPlayed: '2023-11-01',
      };

      statsEndpointsService.getUserStats.and.returnValue(of(userStatsResponse));

      component.ngOnInit();

      expect(component.aboutMeUserInfo).toEqual(userResponse);
      expect(statsEndpointsService.getUserStats).toHaveBeenCalledWith(
        userResponse.id
      );
      expect(component.userStatsInfo).toEqual(userStatsResponse);
    });

    it('should handle error from getMe', () => {
      authEndpointsService.getMe.and.returnValue(throwError('error'));

      component.ngOnInit();

      expect(component.aboutMeUserInfo).toBeNull();
    });

    it('should handle error from getUserStats', () => {
      const userResponse: IUserResponse = {
        id: 1,
        email: 'john.doe@example.com',
        role: TRole.Admin,
        name: 'John Doe',
        studyCycleYearA: 2022,
        studyCycleYearB: 2023,
        lastPlayed: '2024-10-31',
        banned: false,
        course: { id: 1, name: '' },
        group: 'l1',
      };

      authEndpointsService.getMe.and.returnValue(of(userResponse));
      statsEndpointsService.getUserStats.and.returnValue(throwError('error'));

      component.ngOnInit();

      expect(component.userStatsInfo).toBeNull();
    });
  });
});
