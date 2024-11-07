import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DashboardPageComponent } from './dashboard.page.component';
import { UserEndpointsService } from '@endpoints/user-endpoints.service';
import { StatsEndpointsService } from '@endpoints/stats-endpoints.service';
import { of, throwError } from 'rxjs';
import {
  IUserResponse,
  IUserStatsResponse,
} from 'app/shared/models/user.models';
import { TRole } from 'app/shared/models/role.enum';
import { HttpClientTestingModule } from '@angular/common/http/testing';

describe('DashboardPageComponent', () => {
  let component: DashboardPageComponent;
  let fixture: ComponentFixture<DashboardPageComponent>;
  let userEndpointsService: jasmine.SpyObj<UserEndpointsService>;
  let statsEndpointsService: jasmine.SpyObj<StatsEndpointsService>;

  beforeEach(async () => {
    // Dodajemy `verifyJWTToken` z wartością domyślną jako Observable<boolean>
    userEndpointsService = jasmine.createSpyObj('UserEndpointsService', [
      'getMe',
      'verifyJWTToken',
      'logout',
    ]);
    statsEndpointsService = jasmine.createSpyObj('StatsEndpointsService', [
      'getUserStats',
    ]);

    // Ustawiamy verifyJWTToken, aby zwracał Observable true jako wartość domyślną
    userEndpointsService.verifyJWTToken.and.returnValue(of(true));

    await TestBed.configureTestingModule({
      imports: [DashboardPageComponent, HttpClientTestingModule],
      providers: [
        { provide: UserEndpointsService, useValue: userEndpointsService },
        { provide: StatsEndpointsService, useValue: statsEndpointsService },
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
      };

      // Mock the getMe method to return a valid user response
      userEndpointsService.getMe.and.returnValue(of(userResponse));

      const userStatsResponse: IUserStatsResponse = {
        games: 15,
        plays: 30,
        totalStorageMb: 512,
        firstPlayed: '2023-01-01',
        lastPlayed: '2023-11-01',
      };

      // Mock the getUserStats method to return user stats
      statsEndpointsService.getUserStats.and.returnValue(of(userStatsResponse));

      // Call ngOnInit to trigger the subscriptions
      component.ngOnInit();

      // Expectations to ensure data is set correctly
      expect(component.aboutMeUserInfo).toEqual(userResponse);
      expect(statsEndpointsService.getUserStats).toHaveBeenCalledWith(
        userResponse.id
      );
      expect(component.userStatsInfo).toEqual(userStatsResponse);
    });

    it('should handle error from getMe', () => {
      // Mock getMe to throw an error
      userEndpointsService.getMe.and.returnValue(throwError('error'));

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
      };

      userEndpointsService.getMe.and.returnValue(of(userResponse));
      statsEndpointsService.getUserStats.and.returnValue(throwError('error'));

      component.ngOnInit(); // This triggers the call to getUserStats

      // The error from getUserStats should set userStatsInfo to null
      expect(component.userStatsInfo).toBeNull();
    });
  });
});
