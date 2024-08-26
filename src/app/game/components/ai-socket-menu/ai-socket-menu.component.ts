import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { TExchangeData } from '../../models/exchange-data.type';
import { ILoggableDataComponent } from '../../models/loggable-data-component';
import { SocketDomainInputComponent } from './components/components/socket-domain-input/socket-domain-input.component';
import { SocketConnectedMenuComponent } from './components/components/socket-connected-menu/socket-connected-menu.component';
import { DebugModeMenuComponent } from './components/components/debug-mode-menu/debug-mode-menu.component';
import { DebugModePanelComponent } from './components/components/debug-mode-panel/debug-mode-panel.component';
import { AiSocketService } from './services/ai-socket.service';
import { Player } from 'app/game/models/player.class';
import { PlayerSourceType } from 'app/game/models/player-source-type.enum';
import { PlayerSocketMenuComponent } from './components/player-socket-menu.component';

@Component({
  selector: 'app-ai-socket-menu',
  standalone: true,
  imports: [
    SocketDomainInputComponent,
    SocketConnectedMenuComponent,
    DebugModeMenuComponent,
    DebugModePanelComponent,
    PlayerSocketMenuComponent,
  ],
  template: `
    <div class="w-64 h-56 overflow-y-auto p-5 bg-lightGray font-mono text-sm">
      @for (player of players; track player.id) {
        @if (
          player.active && player.getPlayerType === playerSourceType.SOCKET
        ) {
          <app-player-socket-menu
            [player]="player"
            [gameName]="gameName"
            [dataToSend]="dataToSend"
            (receivedDataEmitter)="
              receiveInputData($event)
            "></app-player-socket-menu>
        }
      }
    </div>
  `,
})
export class AiSocketMenuComponent {
  @Input({ required: true }) public players: Player[] = [];
  @Input({ required: true }) public gameName = '';
  @Input({ required: true }) public dataToSend: TExchangeData = {};

  @Output() public receivedDataEmitter = new EventEmitter<TExchangeData>();

  public playerSourceType = PlayerSourceType;

  public receiveInputData(data: TExchangeData): void {
    this.receivedDataEmitter.emit(data);
  }
}
