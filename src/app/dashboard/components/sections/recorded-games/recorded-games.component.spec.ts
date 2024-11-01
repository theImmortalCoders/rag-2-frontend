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
import { of, throwError } from 'rxjs';
import { IGameResponse } from 'app/shared/models/game.models';
import { IRecordedGameResponse } from 'app/shared/models/recorded-game.models';
import { HttpClientTestingModule } from '@angular/common/http/testing';

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

  it('should handle error when fetching available games', fakeAsync(() => {
    const errorMsg = 'Failed to fetch games';
    mockGameEndpointsService.getGames.and.returnValue(
      throwError(() => new Error(errorMsg))
    );

    component.ngOnInit();
    tick();
  }));

  it('should get recorded games when available games are fetched', fakeAsync(() => {
    const mockGames: IGameResponse[] = [{ id: 1, name: 'Game 1' }];
    const mockRecordedGames: IRecordedGameResponse[] = [
      {
        id: 1,
        gameName: 'Game 1',
        started: '',
        ended: '',
        endState: {},
        outputSpec: '',
        players: [],
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

  it('should handle error when getting recorded games', fakeAsync(() => {
    const mockGames: IGameResponse[] = [{ id: 1, name: 'Game 1' }];
    const errorMsg = 'Failed to fetch recorded games';
    mockGameEndpointsService.getGames.and.returnValue(of(mockGames));
    mockGameRecordEndpointsService.getAllRecordedGames.and.returnValue(
      throwError(() => new Error(errorMsg))
    );

    component.ngOnInit();
    tick();
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

  it('should handle error when downloading game record', fakeAsync(() => {
    const errorMsg = 'Failed to download game record';
    mockGameRecordEndpointsService.downloadSpecificRecordedGame.and.returnValue(
      throwError(() => new Error(errorMsg))
    );

    component.downloadGameRecord(1);
    tick();
  }));

  it('should delete game record and notify on success', fakeAsync(() => {
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    mockNotificationService.addNotification.and.callFake(() => {});
    mockGameRecordEndpointsService.deleteGameRecording.and.returnValue(of());

    component.deleteGameRecord(1);
    tick();

    expect(component.errorMessage).toBeNull();
  }));

  it('should handle error when deleting game record', fakeAsync(() => {
    const errorMsg = 'Failed to delete game record';
    mockGameRecordEndpointsService.deleteGameRecording.and.returnValue(
      throwError(() => new Error(errorMsg))
    );

    component.deleteGameRecord(1);
    tick();
  }));

  afterEach(() => {
    fixture.destroy();
  });
});
