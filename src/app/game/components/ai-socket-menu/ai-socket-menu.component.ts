import {
  AfterViewInit,
  Component,
  EventEmitter,
  Input,
  Output,
} from '@angular/core';
import { TExchangeData } from '@gameModels/exchange-data.type';
import { Player } from '@gameModels/player.class';
import { PlayerSourceType } from 'app/shared/models/player-source-type.enum';
import { PlayerSocketMenuComponent } from './sections/player-socket-menu/player-socket-menu.component';
import { Observable } from 'rxjs';
import { Game } from '@gameModels/game.class';
import * as feather from 'feather-icons';

@Component({
  selector: 'app-ai-socket-menu',
  standalone: true,
  imports: [PlayerSocketMenuComponent],
  template: `
    <button
      (click)="toggleAISocketMenu()"
      class="side-menu-left-button top-60 w-12 h-64 {{
        isAISocketMenuVisible ? 'left-72' : 'left-0'
      }}">
      <span
        class="[writing-mode:vertical-rl] [text-orientation:upright] tracking-[0.325em]"
        >AI&nbsp;SOCKET</span
      >
    </button>
    <div
      class="w-72 h-64 overflow-y-auto p-5 bg-lightGray font-mono text-sm side-menu-container top-60 {{
        isAISocketMenuVisible ? 'left-0' : '-left-72'
      }}">
      <div class="group font-mono absolute left-0 top-0 z-30">
        <div
          class="absolute z-30 top-3 left-4 rounded-full bg-lightGray group-hover:bg-mainCreme">
          <i
            data-feather="info"
            class="size-5 text-mainGray group-hover:scale-105 transition-all ease-in-out duration-300"></i>
        </div>
        <div
          class="flex absolute z-20 top-3 left-4 h-5 w-[15.75rem] pointer-events-none opacity-0 group-hover:opacity-100 items-start justify-center rounded-l-full rounded-tr-full bg-mainGray text-mainCreme text-nowrap transition-all ease-in-out duration-300">
          <p
            class="text-center py-[2px] ml-5 pr-4 uppercase text-xs border-b-[1px] border-mainCreme w-full">
            AI socket menu
          </p>
        </div>
        <div
          class="flex flex-col w-[14.5rem] absolute z-10 top-8 left-9 p-2 shadow-menuInfoPanelShadow pointer-events-none opacity-0 group-hover:opacity-100 bg-mainGray text-mainCreme transition-all ease-in-out duration-300">
          <span
            class="text-bold text-2xs text-mainOrange text-justify leading-tight">
            In this menu, you can connect selected player to be controlled by
            selected model or algorithm. You can use previously prepared models
            or connect yours by entering the correct URL for the local WebSocket
            server. <br />
            After successful connection, you must set the data exchange interval
            and then start the exchange. From now, the player is controlled by
            the choosen model. <br />
            There is also a debug mode where you can manually simulate some
            action.
          </span>
        </div>
      </div>
      <div class="flex flex-col space-y-8">
        @for (player of players; track player.id) {
          @if (
            player.isActive && player.playerType === playerSourceType.SOCKET
          ) {
            <app-player-socket-menu
              class="flex flex-col {{ $first ? 'mt-4' : 'mt-0' }}"
              [player]="player"
              [gameName]="gameName"
              [dataToSend]="dataToSend"
              (receivedDataEmitter)="receiveInputData($event)"
              [gamePause]="gamePause"
              [gameRestart]="gameRestart"></app-player-socket-menu>
          }
        }
      </div>
    </div>
  `,
})
export class AiSocketMenuComponent implements AfterViewInit {
  @Input({ required: true }) public players: Player[] = [];
  @Input({ required: true }) public gameName = '';
  @Input({ required: true }) public dataToSend!: Game;
  @Input({ required: true }) public gamePause = new Observable<boolean>();
  @Input({ required: true }) public gameRestart = new Observable<void>();

  @Output() public receivedDataEmitter = new EventEmitter<TExchangeData>();

  public isAISocketMenuVisible = false;
  public playerSourceType = PlayerSourceType;

  public ngAfterViewInit(): void {
    feather.replace();
  }

  public receiveInputData(data: TExchangeData): void {
    this.receivedDataEmitter.emit(data);
  }

  public toggleAISocketMenu(): void {
    this.isAISocketMenuVisible = !this.isAISocketMenuVisible;
  }
}
