import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RecordedGameTableComponent } from './recorded-game-table.component';
import { IRecordedGameResponse } from 'app/shared/models/recorded-game.models';
import { By } from '@angular/platform-browser';
import { TRole } from 'app/shared/models/role.enum';

describe('RecordedGameTableComponent', () => {
  let component: RecordedGameTableComponent;
  let fixture: ComponentFixture<RecordedGameTableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RecordedGameTableComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(RecordedGameTableComponent);
    component = fixture.componentInstance;
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should render the recorded games in the table', () => {
    const mockData: IRecordedGameResponse[] = [
      {
        id: 1,
        gameName: 'Test Game 1',
        started: '2024-01-01T10:00:00',
        ended: '2024-01-01T11:00:00',
        sizeMb: 12.34,
        endState: {},
        outputSpec: '',
        players: [],
        user: {
          id: 1,
          banned: false,
          course: { id: 1, name: 'ee' },
          email: 'eee@wp.pl',
          group: 'L1',
          lastPlayed: '',
          name: 'eee',
          role: TRole.Student,
          studyCycleYearA: 2022,
          studyCycleYearB: 2023,
        },
      },
    ];

    component.recordedGamesData = mockData;
    fixture.detectChanges();

    const rows = fixture.debugElement.queryAll(By.css('div.flex-row'));
    expect(rows.length).toBe(mockData.length + 1);

    const firstRowCells = rows[1].queryAll(By.css('span'));
    expect(firstRowCells[1].nativeElement.textContent.trim()).toBe(
      'Test Game 1'
    );
    expect(firstRowCells[2].nativeElement.textContent.trim()).toContain(
      '01/01/2024'
    );
    expect(firstRowCells[4].nativeElement.textContent.trim()).toBe('12 MB');
  });

  it('should display alternating row styles', () => {
    const mockData: IRecordedGameResponse[] = [
      {
        id: 1,
        gameName: 'Test Game 1',
        started: '2024-01-01T10:00:00',
        ended: '2024-01-01T11:00:00',
        sizeMb: 12.34,
        endState: {},
        outputSpec: '',
        players: [],
        user: {
          id: 1,
          banned: false,
          course: { id: 1, name: 'ee' },
          email: 'eee@wp.pl',
          group: 'L1',
          lastPlayed: '',
          name: 'eee',
          role: TRole.Student,
          studyCycleYearA: 2022,
          studyCycleYearB: 2023,
        },
      },
      {
        id: 2,
        gameName: 'Test Game 2',
        started: '2024-01-01T10:00:00',
        ended: '2024-01-01T11:00:00',
        sizeMb: 12.34,
        endState: {},
        outputSpec: '',
        players: [],
        user: {
          id: 2,
          banned: false,
          course: { id: 1, name: 'ee' },
          email: 'eee@wp.pl',
          group: 'L1',
          lastPlayed: '',
          name: 'eee',
          role: TRole.Student,
          studyCycleYearA: 2022,
          studyCycleYearB: 2023,
        },
      },
    ];

    component.recordedGamesData = mockData;
    fixture.detectChanges();
    const rows = fixture.debugElement.queryAll(
      By.css('div.flex-row:not(:first-child)')
    );
    expect(rows[0].nativeElement.classList).toContain('bg-lightGray');
    expect(rows[1].nativeElement.classList).toContain('bg-darkGray');
  });
});
