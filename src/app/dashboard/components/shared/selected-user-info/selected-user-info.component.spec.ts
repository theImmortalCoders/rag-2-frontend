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
    role: TRole.Student,
    studyCycleYearA: 1,
    studyCycleYearB: 2,
    banned: false,
    id: 1,
    lastPlayed: '2023-11-01T15:30:00.000Z',
    course: { id: 1, name: 'Computer Science' },
    group: 'L1',
  };

  const mockUserStats: IUserStatsResponse = {
    games: 5,
    plays: 20,
    totalStorageMb: 512,
    firstPlayed: '2023-11-01T15:30:00.000Z',
    lastPlayed: '2023-11-01T15:30:00.000Z',
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
      By.css('h3:nth-of-type(1) .text-mainCreme')
    );
    expect(nameElement.nativeElement.textContent).toContain(mockUserData.name);
  });

  it('should display user email', () => {
    const emailElement = fixture.debugElement.query(
      By.css('h3:nth-of-type(2) .text-mainCreme')
    );
    expect(emailElement.nativeElement.textContent).toContain(
      mockUserData.email
    );
  });

  it('should display user role', () => {
    const roleElement = fixture.debugElement.query(
      By.css('h3:nth-of-type(3) .text-mainCreme')
    );
    expect(roleElement.nativeElement.textContent).toContain(mockUserData.role);
  });

  it('should display study cycle years', () => {
    const studyCycleElement = fixture.debugElement.query(
      By.css('h3:nth-of-type(4) .text-mainCreme')
    );
    expect(studyCycleElement.nativeElement.textContent).toContain(
      `${mockUserData.studyCycleYearA}/${mockUserData.studyCycleYearB}`
    );
  });

  it('should display group', () => {
    const groupElement = fixture.debugElement.query(
      By.css('h3:nth-of-type(6) .text-mainCreme')
    );
    expect(groupElement.nativeElement.textContent).toContain(
      mockUserData.group
    );
  });

  it('should display ban status', () => {
    const banStatusElement = fixture.debugElement.query(
      By.css('h3:nth-of-type(7) .text-mainCreme')
    );
    expect(banStatusElement.nativeElement.textContent).toContain('NOT BANNED');
  });

  it('should display types of games played', () => {
    const gamesPlayedElement = fixture.debugElement.query(
      By.css('h3:nth-of-type(8) .text-mainCreme')
    );
    expect(gamesPlayedElement.nativeElement.textContent).toContain(
      mockUserStats.games.toString()
    );
  });

  it('should display total plays in all games', () => {
    const totalPlaysElement = fixture.debugElement.query(
      By.css('h3:nth-of-type(9) .text-mainCreme')
    );
    expect(totalPlaysElement.nativeElement.textContent).toContain(
      mockUserStats.plays.toString()
    );
  });

  it('should display total disk space used', () => {
    const totalDiskSpaceElement = fixture.debugElement.query(
      By.css('h3:nth-of-type(10) .text-mainCreme')
    );
    expect(totalDiskSpaceElement.nativeElement.textContent).toContain(
      `${mockUserStats.totalStorageMb.toPrecision(2)} MB`
    );
  });

  it('should display the first game date', () => {
    const firstPlayedElement = fixture.debugElement.query(
      By.css('h3:nth-of-type(11) .text-mainCreme')
    );
    const expectedDate = new Date(mockUserStats.firstPlayed).toLocaleString(
      'en-GB',
      {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      }
    );
    expect(firstPlayedElement.nativeElement.textContent).toContain(
      expectedDate
    );
  });

  it('should display the last game date', () => {
    const lastPlayedElement = fixture.debugElement.query(
      By.css('h3:nth-of-type(12) .text-mainCreme')
    );
    const expectedDate = new Date(mockUserStats.lastPlayed).toLocaleString(
      'en-GB',
      {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      }
    );
    expect(lastPlayedElement.nativeElement.textContent).toContain(expectedDate);
  });
});
