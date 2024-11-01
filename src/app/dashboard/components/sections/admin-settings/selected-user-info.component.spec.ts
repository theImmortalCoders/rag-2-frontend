import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SelectedUserInfoComponent } from './selected-user-info.component';
import {
  IUserResponse,
  IUserStatsResponse,
} from 'app/shared/models/user.models';
import { By } from '@angular/platform-browser';
import { TRole } from 'app/shared/models/role.enum';

describe('SelectedUserInfoComponent', () => {
  let component: SelectedUserInfoComponent;
  let fixture: ComponentFixture<SelectedUserInfoComponent>;

  const mockUserData: IUserResponse = {
    name: 'John Doe',
    email: 'john.doe@example.com',
    role: 'Student' as TRole,
    studyCycleYearA: 1,
    studyCycleYearB: 2,
    banned: false,
    id: 1,
    lastPlayed: '01/01/2023, 12:00',
  };

  const mockUserStats: IUserStatsResponse = {
    games: 5,
    plays: 20,
    totalStorageMb: 512,
    firstPlayed: '01/11/2023, 15:30',
    lastPlayed: '01/11/2023, 15:30',
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SelectedUserInfoComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(SelectedUserInfoComponent);
    component = fixture.componentInstance;

    // Set the input data for the component
    component.selectedUserData = mockUserData;
    component.selectedUserStats = mockUserStats;
    fixture.detectChanges(); // Trigger change detection
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should display user name', () => {
    const nameElement = fixture.debugElement.query(
      By.css('h3:nth-of-type(1) span')
    );
    expect(nameElement.nativeElement.textContent).toContain(mockUserData.name);
  });

  it('should display user email', () => {
    const emailElement = fixture.debugElement.query(
      By.css('h3:nth-of-type(2) span')
    );
    expect(emailElement.nativeElement.textContent).toContain(
      mockUserData.email
    );
  });

  it('should display user role', () => {
    const roleElement = fixture.debugElement.query(
      By.css('h3:nth-of-type(3) span')
    );
    expect(roleElement.nativeElement.textContent).toContain(mockUserData.role);
  });

  it('should display study cycle years', () => {
    const studyCycleElement = fixture.debugElement.query(
      By.css('h3:nth-of-type(4) span')
    );
    expect(studyCycleElement.nativeElement.textContent).toContain(
      `${mockUserData.studyCycleYearA}/${mockUserData.studyCycleYearB}`
    );
  });

  it('should display ban status', () => {
    const banStatusElement = fixture.debugElement.query(
      By.css('h3:nth-of-type(5) span')
    );
    expect(banStatusElement.nativeElement.textContent).toContain('NOT BANNED');
  });

  it('should display types of games played', () => {
    const gamesPlayedElement = fixture.debugElement.query(
      By.css('h3:nth-of-type(6) span')
    );
    expect(gamesPlayedElement.nativeElement.textContent).toContain(
      mockUserStats.games
    );
  });

  it('should display total plays in all games', () => {
    const totalPlaysElement = fixture.debugElement.query(
      By.css('h3:nth-of-type(7) span')
    );
    expect(totalPlaysElement.nativeElement.textContent).toContain(
      mockUserStats.plays
    );
  });

  it('should display total disk space used', () => {
    const totalDiskSpaceElement = fixture.debugElement.query(
      By.css('h3:nth-of-type(8) span')
    );
    expect(totalDiskSpaceElement.nativeElement.textContent).toContain(
      mockUserStats.totalStorageMb.toPrecision(2) + 'MB'
    );
  });
});
