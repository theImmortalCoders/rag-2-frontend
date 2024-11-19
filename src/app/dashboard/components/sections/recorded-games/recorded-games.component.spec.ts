import {
  ComponentFixture,
  TestBed,
  fakeAsync,
  tick,
} from '@angular/core/testing';
import { RecordedGamesComponent } from './recorded-games.component';
import { GameEndpointsService } from '@endpoints/game-endpoints.service';
import { GameRecordEndpointsService } from '@endpoints/game-record-endpoints.service';
import { NotificationService } from 'app/shared/services/notification.service';
import { of } from 'rxjs';
import { IGameResponse } from 'app/shared/models/game.models';
import { IRecordedGameResponse } from 'app/shared/models/recorded-game.models';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { TRole } from 'app/shared/models/role.enum';

describe('RecordedGamesComponent', () => {
  let component: RecordedGamesComponent;
  let fixture: ComponentFixture<RecordedGamesComponent>;
  let mockGameEndpointsService: jasmine.SpyObj<GameEndpointsService>;
  let mockGameRecordEndpointsService: jasmine.SpyObj<GameRecordEndpointsService>;
  let mockNotificationService: jasmine.SpyObj<NotificationService>;

  beforeEach(async () => {
    mockGameEndpointsService = jasmine.createSpyObj('GameEndpointsService', [
      'getGames',
    ]);
    mockGameRecordEndpointsService = jasmine.createSpyObj(
      'GameRecordEndpointsService',
      [
        'getAllRecordedGames',
        'downloadSpecificRecordedGame',
        'deleteGameRecording',
      ]
    );
    mockNotificationService = jasmine.createSpyObj('NotificationService', [
      'addNotification',
    ]);

    await TestBed.configureTestingModule({
      imports: [RecordedGamesComponent, HttpClientTestingModule],
      providers: [
        { provide: GameEndpointsService, useValue: mockGameEndpointsService },
        {
          provide: GameRecordEndpointsService,
          useValue: mockGameRecordEndpointsService,
        },
        { provide: NotificationService, useValue: mockNotificationService },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(RecordedGamesComponent);
    component = fixture.componentInstance;
  });

  it('should get recorded games when available games are fetched', fakeAsync(() => {
    const mockGames: IGameResponse[] = [
      { id: 1, name: 'Game 1', description: 'dfgdfg' },
    ];
    const mockRecordedGames: IRecordedGameResponse[] = [
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
      },
    ];
    mockGameEndpointsService.getGames.and.returnValue(of(mockGames));
    mockGameRecordEndpointsService.getAllRecordedGames.and.returnValue(
      of(mockRecordedGames)
    );

    component.ngOnInit();
    tick();

    expect(component.recordedGamesData).toEqual(mockRecordedGames);
    expect(component.errorMessage).toBeNull();
  }));

  it('should download game record and notify on success', fakeAsync(() => {
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    mockNotificationService.addNotification.and.callFake(() => {});
    mockGameRecordEndpointsService.downloadSpecificRecordedGame.and.returnValue(
      of()
    );

    component.downloadGameRecord(1);
    tick();

    expect(component.errorMessage).toBeNull();
  }));

  it('should delete game record and notify on success', fakeAsync(() => {
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    mockNotificationService.addNotification.and.callFake(() => {});
    mockGameRecordEndpointsService.deleteGameRecording.and.returnValue(of());

    component.deleteGameRecord(1);
    tick();

    expect(component.errorMessage).toBeNull();
  }));

  afterEach(() => {
    fixture.destroy();
  });
});
