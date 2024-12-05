import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RecordedGameTableComponent } from './recorded-game-table.component';
import { LoadingSpinnerComponent } from 'app/shared/components/common/loading-spinner.component';
import { By } from '@angular/platform-browser';
import { TRole } from 'app/shared/models/role.enum';
import { HttpClientTestingModule } from '@angular/common/http/testing';

describe('RecordedGameTableComponent', () => {
  let component: RecordedGameTableComponent;
  let fixture: ComponentFixture<RecordedGameTableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        RecordedGameTableComponent,
        LoadingSpinnerComponent,
        HttpClientTestingModule,
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(RecordedGameTableComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display loading spinner when isLoading is true', () => {
    component.isLoading = true;
    fixture.detectChanges();
    const spinner = fixture.debugElement.query(By.css('app-loading-spinner'));
    expect(spinner).toBeTruthy();
  });

  it('should display table when isLoading is false and recordedGamesData is not null', () => {
    component.isLoading = false;
    component.recordedGamesData = [
      {
        id: 1,
        gameName: 'Game 1',
        started: '',
        ended: '',
        endState: {},
        outputSpec: '',
        players: [],
        sizeMb: 2,
        user: {
          id: 1,
          banned: true,
          course: { id: 1, name: 'ee' },
          email: 'ttt',
          group: 'l1',
          lastPlayed: '',
          name: '',
          role: TRole.Student,
          studyCycleYearA: 2022,
          studyCycleYearB: 2023,
        },
        isEmptyRecord: false,
      },
    ];
    fixture.detectChanges();
    const tableRows = fixture.debugElement.queryAll(By.css('.flex-row'));
    expect(tableRows.length).toBeGreaterThan(0);
  });

  it('should emit downloadEmitter when download button is clicked', () => {
    const spy = spyOn(component.downloadEmitter, 'emit');
    component.recordedGamesData = [
      {
        id: 1,
        gameName: 'Game 1',
        started: '',
        ended: '',
        endState: {},
        outputSpec: '',
        players: [],
        sizeMb: 2,
        user: {
          id: 1,
          banned: true,
          course: { id: 1, name: 'ee' },
          email: 'ttt',
          group: 'l1',
          lastPlayed: '',
          name: '',
          role: TRole.Student,
          studyCycleYearA: 2022,
          studyCycleYearB: 2023,
        },
        isEmptyRecord: false,
      },
    ];
    fixture.detectChanges();

    const downloadButton = fixture.debugElement.query(
      By.css('button#downloadButton')
    );
    downloadButton.nativeElement.click();
    expect(spy).toHaveBeenCalledWith(1);
  });

  it('should emit deleteEmitter when delete button is clicked', () => {
    const spy = spyOn(component.deleteEmitter, 'emit');
    component.recordedGamesData = [
      {
        id: 1,
        gameName: 'Game 1',
        started: '',
        ended: '',
        endState: {},
        outputSpec: '',
        players: [],
        sizeMb: 2,
        user: {
          id: 1,
          banned: true,
          course: { id: 1, name: 'ee' },
          email: 'ttt',
          group: 'l1',
          lastPlayed: '',
          name: '',
          role: TRole.Student,
          studyCycleYearA: 2022,
          studyCycleYearB: 2023,
        },
        isEmptyRecord: false,
      },
    ];
    fixture.detectChanges();

    const deleteButton = fixture.debugElement.query(
      By.css('button#deleteButton')
    );
    deleteButton.nativeElement.click();
    expect(spy).toHaveBeenCalledWith(1);
  });
});
