import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GameMenuComponent } from './game-menu.component';
import { TGameDataSendingType } from '../../models/game-data-sending-type';

describe('TimeMenuComponent', () => {
  let component: GameMenuComponent;
  let fixture: ComponentFixture<GameMenuComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GameMenuComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(GameMenuComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have a default gameDataSendingType', () => {
    expect(component.gameDataSendingType).toEqual(
      TGameDataSendingType.EventGame
    );
  });
});
