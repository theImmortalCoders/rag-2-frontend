import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { AiSocketMenuComponent } from './ai-socket-menu.component';
import { PlayerSourceType } from 'app/game/models/player-source-type.enum';
import { TExchangeData } from 'app/game/models/exchange-data.type';
import { Component, Input, Output, EventEmitter } from '@angular/core';
import { Player } from 'app/game/models/player.class';

@Component({
  selector: 'app-player-socket-menu',
  template: '',
})
class MockPlayerSocketMenuComponent {
  @Input() public player!: Player;
  @Input() public gameName!: string;
  @Input() public setDataToSend!: TExchangeData;
  @Output() public receivedDataEmitter = new EventEmitter<TExchangeData>();
}

describe('AiSocketMenuComponent', () => {
  let component: AiSocketMenuComponent;
  let fixture: ComponentFixture<AiSocketMenuComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AiSocketMenuComponent],
      declarations: [MockPlayerSocketMenuComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AiSocketMenuComponent);
    component = fixture.componentInstance;
    component.players = [
      { id: 1, active: true, getPlayerType: PlayerSourceType.SOCKET } as Player,
      {
        id: 2,
        active: false,
        getPlayerType: PlayerSourceType.SOCKET,
      } as Player,
    ];
    component.gameName = 'Test Game';
    component.dataToSend = { key: 'value' } as TExchangeData;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should toggle AI socket menu visibility', () => {
    expect(component.isAISocketMenuVisible).toBeFalse();
    component.toggleAISocketMenu();
    expect(component.isAISocketMenuVisible).toBeTrue();
    component.toggleAISocketMenu();
    expect(component.isAISocketMenuVisible).toBeFalse();
  });

  it('should emit received data', () => {
    spyOn(component.receivedDataEmitter, 'emit');
    const data: TExchangeData = { key: 'value' };
    component.receiveInputData(data);
    expect(component.receivedDataEmitter.emit).toHaveBeenCalledWith(data);
  });

  it('should apply correct classes based on AI socket menu visibility', () => {
    const menuDiv = fixture.debugElement.query(
      By.css('div.side-menu-container')
    );
    expect(menuDiv.nativeElement.className).toContain('-right-64');

    component.toggleAISocketMenu();
    fixture.detectChanges();

    expect(menuDiv.nativeElement.className).toContain('right-0');
  });
});
