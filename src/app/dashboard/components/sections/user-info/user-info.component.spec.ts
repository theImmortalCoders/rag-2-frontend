import { ComponentFixture, TestBed } from '@angular/core/testing';
import { UserInfoComponent } from './user-info.component';
import { ProgressCircleBarComponent } from '@dashboardComponents/progress-circle-bar/progress-circle-bar.component';
import { IUserResponse, IUserStatsResponse } from '@api-models/user.models';
import { TRole } from 'app/shared/models/role.enum';
import { HttpClientTestingModule } from '@angular/common/http/testing';

describe('UserInfoComponent', () => {
  let component: UserInfoComponent;
  let fixture: ComponentFixture<UserInfoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        UserInfoComponent,
        ProgressCircleBarComponent,
        HttpClientTestingModule,
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(UserInfoComponent);
    component = fixture.componentInstance;
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should bind aboutMeUserInfo input', () => {
    const user: IUserResponse = {
      id: 1,
      name: 'Jan Kowalski',
      email: 'jan.kowalski@example.com',
      role: 'Student' as TRole,
      studyCycleYearA: 1,
      studyCycleYearB: 3,
      banned: false,
      lastPlayed: '2024-11-01T11:55:09.574Z',
      course: { id: 1, name: '' },
      group: 'l1',
    };

    component.aboutMeUserInfo = user; // Ustawienie inputa
    fixture.detectChanges(); // Wykonaj detekcję zmian

    expect(component.aboutMeUserInfo).toEqual(user); // Sprawdzenie, czy input jest ustawiony
  });

  it('should bind userStatsInfo input', () => {
    const userStats: IUserStatsResponse = {
      games: 1,
      plays: 5,
      firstPlayed: '2024-11-01T11:55:09.574Z',
      lastPlayed: '2024-11-01T11:55:09.574Z',
      totalStorageMb: 5,
    };

    component.userStatsInfo = userStats; // Ustawienie inputa
    fixture.detectChanges(); // Wykonaj detekcję zmian

    expect(component.userStatsInfo).toEqual(userStats); // Sprawdzenie, czy input jest ustawiony
  });
});
