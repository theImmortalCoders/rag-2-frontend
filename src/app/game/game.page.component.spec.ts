import { TestBed, ComponentFixture } from '@angular/core/testing';
import { ActivatedRoute, Router } from '@angular/router';
import { NgComponentOutlet } from '@angular/common';
import { GamePageComponent } from './game.page.component';
import { PongGameWindowComponent } from './components/games/pong/pong.component';
import { ConsoleComponent } from './components/console/console.component';
import { of } from 'rxjs';
import { TGameDataSendingType } from './models/game-data-sending-type.enum';
import { TExchangeData } from './models/exchange-data.type';
import { By } from '@angular/platform-browser';
import { EventEmitter } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';

describe('GamePageComponent', () => {
  let component: GamePageComponent;
  let fixture: ComponentFixture<GamePageComponent>;
  let mockRoute: unknown;
  let mockRouter: unknown;

  beforeEach(async () => {
    mockRoute = {
      paramMap: of({
        get: () => 'pong',
      }),
    };

    mockRouter = {
      navigate: jasmine.createSpy('navigate'),
    };

    await TestBed.configureTestingModule({
      imports: [
        GamePageComponent,
        ConsoleComponent,
        PongGameWindowComponent,
        HttpClientModule,
      ],
      providers: [
        { provide: ActivatedRoute, useValue: mockRoute },
        { provide: Router, useValue: mockRouter },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(GamePageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should set gameName based on route parameter', () => {
    expect(component.gameName).toBe('pong');
  });

  it('should pass logData to ConsoleComponent', () => {
    const testLogData: Record<string, TExchangeData> = {
      menu: { message: 'Test message', level: 'info' },
    };
    component.logData = testLogData;
    fixture.detectChanges();

    const consoleComponent = fixture.debugElement.query(
      By.directive(ConsoleComponent)
    ).componentInstance;
    expect(consoleComponent.logData).toEqual(testLogData);
  });
});
