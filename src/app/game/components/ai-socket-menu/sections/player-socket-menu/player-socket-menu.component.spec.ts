import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PlayerSocketMenuComponent } from './player-socket-menu.component';
import { Player } from '@gameModels/player.class';
import { DebugModeMenuComponent } from '../debug-mode-menu/debug-mode-menu.component';
import { DebugModePanelComponent } from '../debug-mode-panel/debug-mode-panel.component';
import { SocketDomainInputComponent } from '../socket-domain-input/socket-domain-input.component';
import { SocketConnectedMenuComponent } from '../socket-connected-menu/socket-connected-menu.component';
import { AiSocketService } from '../../services/ai-socket.service';
import { By } from '@angular/platform-browser';
import { PlayerSourceType } from 'app/shared/models/player-source-type.enum';

describe('PlayerSocketMenuComponent', () => {
  let component: PlayerSocketMenuComponent;
  let fixture: ComponentFixture<PlayerSocketMenuComponent>;
  let mockPlayer: Player;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        PlayerSocketMenuComponent,
        DebugModeMenuComponent,
        DebugModePanelComponent,
        SocketDomainInputComponent,
        SocketConnectedMenuComponent,
      ],
      providers: [AiSocketService],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PlayerSocketMenuComponent);
    component = fixture.componentInstance;

    mockPlayer = new Player(1, true, 'p1', {}, PlayerSourceType.KEYBOARD);
    component.player = mockPlayer;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should toggle debug mode based on event from DebugModeMenuComponent', () => {
    const debugModeMenuComponent = fixture.debugElement.query(
      By.directive(DebugModeMenuComponent)
    ).componentInstance;
    debugModeMenuComponent.debugModeEmitter.emit(true);
    fixture.detectChanges();
    expect(component.isDebugModeActive).toBeTrue();

    debugModeMenuComponent.debugModeEmitter.emit(false);
    fixture.detectChanges();
    expect(component.isDebugModeActive).toBeFalse();
  });

  it('should conditionally render DebugModePanelComponent based on isDebugModeActive', () => {
    component.isDebugModeActive = true;
    fixture.detectChanges();
    let debugModePanelComponent = fixture.debugElement.query(
      By.directive(DebugModePanelComponent)
    );
    expect(debugModePanelComponent).not.toBeNull();

    component.isDebugModeActive = false;
    fixture.detectChanges();
    debugModePanelComponent = fixture.debugElement.query(
      By.directive(DebugModePanelComponent)
    );
    expect(debugModePanelComponent).toBeNull();
  });
});
