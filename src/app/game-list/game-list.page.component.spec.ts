import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { GameListPageComponent } from './game-list.page.component';
import { GameEndpointsService } from '@endpoints/game-endpoints.service';
import { StatsEndpointsService } from '@endpoints/stats-endpoints.service';
import { of } from 'rxjs';
import { IGameResponse, IGameStatsResponse } from '@api-models/game.models';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';

interface IExtendendGameStats {
  name?: string;
  plays: number;
  totalPlayers: number;
  totalStorageMb: number;
  firstPlayed: string;
  lastPlayed: string;
  statsUpdatedDate: string;
}

describe('GameListPageComponent', () => {
  let component: GameListPageComponent;
  let fixture: ComponentFixture<GameListPageComponent>;
  let mockGameEndpointsService: jasmine.SpyObj<GameEndpointsService>;
  let mockStatsEndpointsService: jasmine.SpyObj<StatsEndpointsService>;

  beforeEach(waitForAsync(() => {
    mockGameEndpointsService = jasmine.createSpyObj('GameEndpointsService', [
      'getGames',
    ]);
    mockStatsEndpointsService = jasmine.createSpyObj('StatsEndpointsService', [
      'getGameStats',
    ]);

    TestBed.configureTestingModule({
      imports: [
        GameListPageComponent,
        HttpClientTestingModule,
        RouterTestingModule,
      ],
      providers: [
        { provide: GameEndpointsService, useValue: mockGameEndpointsService },
        { provide: StatsEndpointsService, useValue: mockStatsEndpointsService },
      ],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GameListPageComponent);
    component = fixture.componentInstance;
  });

  afterEach(() => {
    fixture.destroy();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  describe('ngOnInit', () => {
    it('should call getGames and initialize extendendGameList and gameStatsList', () => {
      const mockGames: IGameResponse[] = [
        { id: 1, name: 'Game1', description: 'Description1' },
        { id: 2, name: 'Game2', description: 'Description2' },
      ];
      mockGameEndpointsService.getGames.and.returnValue(of(mockGames));
      mockStatsEndpointsService.getGameStats.and.returnValue(
        of({
          plays: 100,
          totalPlayers: 50,
          totalStorageMb: 10,
          firstPlayed: '2022-01-01T00:00:00Z',
          lastPlayed: '2022-01-10T00:00:00Z',
          statsUpdatedDate: '2022-01-15T00:00:00Z',
        } as IGameStatsResponse)
      );

      component.ngOnInit();

      expect(mockGameEndpointsService.getGames).toHaveBeenCalled();
      expect(component.extendendGameList.length).toBe(2);
      expect(component.gameStatsList.length).toBe(2);
    });
  });

  describe('switchView', () => {
    it('should toggle isStatsChoosen for a selected game', () => {
      component.extendendGameList = [
        {
          id: 1,
          name: 'Game1',
          description: 'Description1',
          isStatsChoosen: false,
        },
      ];

      component.switchView(1);

      expect(component.extendendGameList[0].isStatsChoosen).toBeTrue();

      component.switchView(1);

      expect(component.extendendGameList[0].isStatsChoosen).toBeFalse();
    });
  });

  describe('isStatsViewChoosen', () => {
    it('should return true if stats view is chosen for the game', () => {
      component.extendendGameList = [
        {
          id: 1,
          name: 'Game1',
          description: 'Description1',
          isStatsChoosen: true,
        },
      ];

      expect(component.isStatsViewChoosen(1)).toBeTrue();
    });

    it('should return false if stats view is not chosen for the game', () => {
      component.extendendGameList = [
        {
          id: 1,
          name: 'Game1',
          description: 'Description1',
          isStatsChoosen: false,
        },
      ];

      expect(component.isStatsViewChoosen(1)).toBeFalse();
    });
  });

  describe('getGameStatsByName', () => {
    it('should return stats for a given game name', () => {
      component.gameStatsList = [
        {
          name: 'Game1',
          plays: 10,
          totalPlayers: 5,
          totalStorageMb: 1,
          firstPlayed: '',
          lastPlayed: '',
          statsUpdatedDate: '',
        },
      ];

      const stats = component.getGameStatsByName('Game1');
      expect(stats.plays).toBe(10);
      expect(stats.totalPlayers).toBe(5);
    });

    it('should return an empty object if the game name does not exist', () => {
      const stats = component.getGameStatsByName('NonExistentGame');
      expect(stats).toEqual({} as IExtendendGameStats);
    });
  });

  describe('ngOnDestroy', () => {
    it('should unsubscribe from all subscriptions', () => {
      const unsubscribeSpy = spyOn(
        component['_getGamesSubscription'],
        'unsubscribe'
      );
      const unsubscribeStatsSpy = spyOn(
        component['_getGameStatsSubscription'],
        'unsubscribe'
      );

      component.ngOnDestroy();

      expect(unsubscribeSpy).toHaveBeenCalled();
      expect(unsubscribeStatsSpy).toHaveBeenCalled();
    });
  });
});
