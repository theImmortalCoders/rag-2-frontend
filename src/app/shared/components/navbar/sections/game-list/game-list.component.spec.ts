import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { of, throwError } from 'rxjs';
import { GameListComponent } from './game-list.component';
import { GameEndpointsService } from '@endpoints/game-endpoints.service';
import { IGameResponse } from 'app/shared/models/game.models';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';

describe('GameListComponent', () => {
  let component: GameListComponent;
  let fixture: ComponentFixture<GameListComponent>;
  let gameEndpointsServiceSpy: jasmine.SpyObj<GameEndpointsService>;

  const mockGames: IGameResponse[] = [
    { id: 1, name: 'Game One', description: 'one' },
    { id: 2, name: 'Game Two', description: 'two' },
  ];

  beforeEach(waitForAsync(() => {
    const spy = jasmine.createSpyObj('GameEndpointsService', ['getGames']);

    TestBed.configureTestingModule({
      imports: [
        RouterTestingModule,
        GameListComponent,
        HttpClientTestingModule,
      ],
      providers: [{ provide: GameEndpointsService, useValue: spy }],
    }).compileComponents();

    gameEndpointsServiceSpy = TestBed.inject(
      GameEndpointsService
    ) as jasmine.SpyObj<GameEndpointsService>;
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GameListComponent);
    component = fixture.componentInstance;
  });

  afterEach(() => {
    component.ngOnDestroy();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize and load games successfully', () => {
    gameEndpointsServiceSpy.getGames.and.returnValue(of(mockGames));

    fixture.detectChanges();

    expect(component.games).toEqual(mockGames);
    expect(gameEndpointsServiceSpy.getGames).toHaveBeenCalled();
  });

  it('should handle error when loading games', () => {
    gameEndpointsServiceSpy.getGames.and.returnValue(
      throwError(() => new Error('Failed to load games'))
    );

    fixture.detectChanges();

    expect(component.games).toBeNull();
    expect(gameEndpointsServiceSpy.getGames).toHaveBeenCalled();
  });

  it('should unsubscribe from getGames on component destruction', () => {
    gameEndpointsServiceSpy.getGames.and.returnValue(of(mockGames));
    fixture.detectChanges();

    const unsubscribeSpy = spyOn(
      component['_getGamesSubscription'],
      'unsubscribe'
    ).and.callThrough();

    component.ngOnDestroy();

    expect(unsubscribeSpy).toHaveBeenCalled();
  });

  it('should render game list when games data is available', () => {
    gameEndpointsServiceSpy.getGames.and.returnValue(of(mockGames));

    fixture.detectChanges();
    const compiled = fixture.nativeElement as HTMLElement;
    const gameItems = compiled.querySelectorAll('li > a');

    expect(gameItems.length).toBe(mockGames.length);
    expect(gameItems[0].textContent).toContain('Game One');
    expect(gameItems[1].textContent).toContain('Game Two');
  });
});
