import {
  Component,
  EventEmitter,
  Input,
  OnDestroy,
  OnInit,
  Output,
} from '@angular/core';
import { TExchangeData } from 'app/game/models/exchange-data.type';
import { Player } from 'app/game/models/player.class';
import { DebugModeMenuComponent } from './components/components/debug-mode-menu/debug-mode-menu.component';
import { DebugModePanelComponent } from './components/components/debug-mode-panel/debug-mode-panel.component';
import { SocketDomainInputComponent } from './components/components/socket-domain-input/socket-domain-input.component';
import { SocketConnectedMenuComponent } from './components/components/socket-connected-menu/socket-connected-menu.component';
import { PlayerSocketConnectionMenuComponent } from './components/player-socket-connection-menu.component';
import { Observable, Subscription } from 'rxjs';

@Component({
  selector: 'app-player-socket-menu',
  standalone: true,
  imports: [
    DebugModeMenuComponent,
    DebugModePanelComponent,
    SocketDomainInputComponent,
    SocketConnectedMenuComponent,
    PlayerSocketConnectionMenuComponent,
  ],

  template: `
    {{ player.name }}
    <app-debug-mode-menu (debugModeEmitter)="isDebugModeActive = $event" />
    @if (isDebugModeActive) {
      <app-debug-mode-panel
        [expectedInput]="player.inputData"
        (inputEmitter)="emitSocketInput($event)" />
    } @else {
      <app-player-socket-connection-menu
        [player]="player"
        [setDataToSend]="dataToSend"
        (receivedDataEmitter)="receivedDataEmitter.emit($event)"
        [gameName]="gameName"
        [gamePause]="gamePause"
        [gameRestart]="gameRestart" />
    }
  `,
})
export class PlayerSocketMenuComponent {
  @Input({ required: true }) public player!: Player;
  @Input({ required: true }) public gameName = '';
  @Input({ required: true }) public dataToSend: TExchangeData = {};
  @Input({ required: true }) public gamePause = new Observable<boolean>();
  @Input({ required: true }) public gameRestart = new Observable<void>();

  @Output() public receivedDataEmitter = new EventEmitter<TExchangeData>();

  public isDebugModeActive = false;

  public emitSocketInput(data: TExchangeData): void {
    this.receivedDataEmitter.emit({ player: this.player, data: data });
  }
}
