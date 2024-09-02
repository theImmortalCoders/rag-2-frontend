import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Player } from 'app/game/models/player.class';
import { PlayerSourceType } from 'app/game/models/player-source-type.enum';
import { PongGameWindowComponent } from './pong.component';
import { TExchangeData } from 'app/game/models/exchange-data.type';

describe('PongComponent', () => {
  let component: PongGameWindowComponent;
  let fixture: ComponentFixture<PongGameWindowComponent>;
  let mockPlayers: Player[];

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
});
