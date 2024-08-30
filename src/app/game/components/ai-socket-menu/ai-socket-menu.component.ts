import { Component, EventEmitter, Input, Output } from '@angular/core';
import { TExchangeData } from '../../models/exchange-data.type';
import { SocketDomainInputComponent } from './components/components/components/socket-domain-input/socket-domain-input.component';
import { SocketConnectedMenuComponent } from './components/components/components/socket-connected-menu/socket-connected-menu.component';
import { DebugModeMenuComponent } from './components/components/components/debug-mode-menu/debug-mode-menu.component';
import { DebugModePanelComponent } from './components/components/components/debug-mode-panel/debug-mode-panel.component';
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
    <button
      (click)="toggleAISocketMenu()"
      class="side-menu-button top-52 w-12 h-56 {{
        isAISocketMenuVisible ? 'right-64' : 'right-0'
      }}">
      <span
        class="[writing-mode:vertical-rl] [text-orientation:upright] tracking-[0.325em]"
        >AI&nbsp;SOCKET</span
      >
    </button>
    <div
      class="w-64 h-56 overflow-y-auto p-5 bg-lightGray font-mono text-sm side-menu-container top-52 {{
        isAISocketMenuVisible ? 'right-0' : '-right-64'
      }}">
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

  public isAISocketMenuVisible = false;
  public playerSourceType = PlayerSourceType;

  public receiveInputData(data: TExchangeData): void {
    this.receivedDataEmitter.emit(data);
  }

  public toggleAISocketMenu(): void {
    this.isAISocketMenuVisible = !this.isAISocketMenuVisible;
  }
}
