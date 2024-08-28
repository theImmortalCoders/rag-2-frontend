import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { ActivatedRoute, convertToParamMap } from '@angular/router';
import { of } from 'rxjs';
import { GamePageComponent } from './game.page.component';
import { ConsoleComponent } from './components/console/console.component';
import { DataMenuComponent } from './components/data-menu/data-menu.component';
import { AiSocketMenuComponent } from './components/ai-socket-menu/ai-socket-menu.component';
import { PongGameWindowComponent } from './games/pong/pong.component';
import { TictactoeGameWindowComponent } from './games/tictactoe/tictactoe.component';
import { AuthRequiredDirective } from '@utils/directives/auth-required.directive';
import { ExchangeDataPipe } from '@utils/pipes/exchange-data.pipe';
import { games } from './data-access/games';
import { Game } from './models/game.class';
import { TExchangeData } from './models/exchange-data.type';

describe('GamePageComponent', () => {
  let component: GamePageComponent;
  let fixture: ComponentFixture<GamePageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        GamePageComponent,
        RouterTestingModule,
        ConsoleComponent,
        DataMenuComponent,
        AiSocketMenuComponent,
        PongGameWindowComponent,
        TictactoeGameWindowComponent,
        AuthRequiredDirective,
        ExchangeDataPipe,
      ],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: {
            paramMap: of(convertToParamMap({ gameName: 'pong' })),
          },
        },
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(GamePageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize gameName from route parameters', () => {
    expect(component.gameName).toBe('pong');
  });

  it('should load the game based on gameName', () => {
    component.ngOnInit();
    expect(component.game).toEqual(games['pong']);
  });

  it('should update logData when receiveGameOutputData is called', () => {
    const mockData: TExchangeData = { output: { someKey: 'someValue' } };
    component.receiveGameOutputData(mockData);
    expect(component.gameWindowOutputData).toEqual(
      mockData['output'] as TExchangeData
    );
    expect(component.logData['game window']).toEqual(mockData);
  });

  it('should update socketInputData when receiveSocketInputData is called', () => {
    const mockData: TExchangeData = { input: { anotherKey: 'anotherValue' } };
    component.receiveSocketInputData(mockData);
    expect(component.socketInputData).toEqual(mockData);
  });

  it('should unsubscribe from router events on component destroy', () => {
    const routerSubscription = component['_routerSubscription'];
    component.ngOnDestroy();
    expect(routerSubscription?.closed).toBeTrue();
  });
});
