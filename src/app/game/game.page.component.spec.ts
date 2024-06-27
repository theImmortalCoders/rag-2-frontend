import { TestBed, ComponentFixture } from '@angular/core/testing';
import { ActivatedRoute, Router } from '@angular/router';
import { NgComponentOutlet } from '@angular/common';
import { GameBaseComponent } from './game.page.component';
import { PongComponent } from './components/pong/pong.component';

describe('GameComponent', () => {
  let component: GameBaseComponent;
  let fixture: ComponentFixture<GameBaseComponent>;
  let mockRoute: unknown;
  let mockRouter: unknown;

  beforeEach(async () => {
    mockRoute = {
      snapshot: {
        paramMap: {
          get: (): string => 'pong',
        },
      },
    };

    mockRouter = {
      navigate: jasmine.createSpy('navigate'),
    };

    await TestBed.configureTestingModule({
      imports: [NgComponentOutlet, GameBaseComponent],
      providers: [
        { provide: ActivatedRoute, useValue: mockRoute },
        { provide: Router, useValue: mockRouter },
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(GameBaseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should set gameName based on route parameter', () => {
    expect(component.gameName).toBe('pong');
  });

  it('should set the correct component based on gameName', () => {
    expect(component.component).toBe(PongComponent);
  });
});
