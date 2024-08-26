import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Player } from 'app/game/models/player.class';
import { PlayerSourceType } from 'app/game/models/player-source-type.enum';
import { PongGameWindowComponent } from './pong.component';
import { TExchangeData } from 'app/game/models/exchange-data.type';

describe('PongComponent', () => {
  let component: PongGameWindowComponent;
  let fixture: ComponentFixture<PongGameWindowComponent>;
  let mockPlayers: Player[];
  let mockExchangeData: TExchangeData;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PongGameWindowComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PongGameWindowComponent);
    component = fixture.componentInstance;

    mockPlayers = [
      new Player(1, true, 'Player 1', PlayerSourceType.KEYBOARD),
      new Player(2, true, 'Player 2', PlayerSourceType.KEYBOARD),
    ];

    component.players = mockPlayers;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should update p1Move and p2Move based on setSocketInputDataReceive', () => {
    mockExchangeData = {
      text: 'test',
      text2: 'test2',
      p1Move: 1,
      p2Move: -1,
      data: { move: 1 },
      player: mockPlayers[0],
    };

    component.setSocketInputDataReceive = mockExchangeData;
    expect(component.p1Move).toBe(1);
    expect(component.p2Move).toBe(0);

    component.setSocketInputDataReceive = mockExchangeData;
    expect(component.p2Move).toBe(0);
  });
});
