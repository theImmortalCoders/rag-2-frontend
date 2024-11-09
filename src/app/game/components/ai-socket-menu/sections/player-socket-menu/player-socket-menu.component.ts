import { Component, EventEmitter, Input, Output } from '@angular/core';
import { TExchangeData } from '@gameModels/exchange-data.type';
import { Player } from '@gameModels/player.class';
import { DebugModeMenuComponent } from '../debug-mode-menu/debug-mode-menu.component';
import { DebugModePanelComponent } from '../debug-mode-panel/debug-mode-panel.component';
import { PlayerSocketConnectionMenuComponent } from '../player-socket-connection-menu/player-socket-connection-menu.component';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-player-socket-menu',
  standalone: true,
  imports: [
    DebugModeMenuComponent,
    DebugModePanelComponent,
    PlayerSocketConnectionMenuComponent,
  ],

  template: `
    <h3 class="text-mainOrange text-lg font-bold uppercase">
      {{ player.name }}
    </h3>
    <app-debug-mode-menu (debugModeEmitter)="isDebugModeActive = $event" />
    @if (isDebugModeActive) {
      <app-debug-mode-panel
        [player]="player"
        [expectedInput]="player.inputData"
        (inputEmitter)="receivedDataEmitter.emit($event)" />
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
}
