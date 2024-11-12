import {
  AfterViewInit,
  Component,
  EventEmitter,
  inject,
  Input,
  OnInit,
  Output,
} from '@angular/core';
import { PlayerSourceType } from 'app/shared/models/player-source-type.enum';
import { Player } from '@gameModels/player.class';
import { UrlParamService } from 'app/shared/services/url-param.service';

@Component({
  selector: 'app-player-menu',
  standalone: true,
  template: `
    <button
      (click)="togglePlayerMenu()"
      class="side-menu-left-button -top-4 w-12 h-60 {{
        isPlayerMenuVisible ? 'left-72' : 'left-0'
      }}">
      <span
        class="[writing-mode:vertical-rl] [text-orientation:upright] tracking-[0.45em]"
        >PLAYERS</span
      >
    </button>
    <div
      class="w-72 h-60 overflow-y-auto p-5 bg-lightGray font-mono text-sm side-menu-container -top-4 {{
        isPlayerMenuVisible ? 'left-0' : '-left-72'
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
            Players menu
          </p>
        </div>
        <div
          class="flex flex-col w-[14.5rem] absolute z-10 top-8 left-9 p-2 shadow-menuInfoPanelShadow pointer-events-none opacity-0 group-hover:opacity-100 bg-mainGray text-mainCreme transition-all ease-in-out duration-300">
          <span
            class="text-bold text-2xs text-mainOrange text-justify leading-tight">
            In this menu, you can choose all players control source. If you
            choose WebSocket control for at least one player, an additional menu
            will appear.
          </span>
        </div>
      </div>
      @for (player of players; track player.id) {
        <div
          class="flex flex-col space-y-1 pb-2 {{
            $index === 0 ? 'mt-4' : 'mt-0'
          }}">
          <span class="text-mainOrange text-lg font-bold uppercase">{{
            player.name
          }}</span>
          <span class="text-mainCreme font-bold">Select player source:</span>
          <select
            #playerSourceSelect
            class="custom-input w-full"
            [attr.disabled]="!player.isActive ? 'disabled' : null"
            (change)="updateSources(player, playerSourceSelect.value)">
            @for (source of playerSourceType; track source) {
              <option
                [value]="source"
                [selected]="source === player.playerType">
                {{ source }}
              </option>
            }
          </select>
          @if (!player.isObligatory) {
            <div>
              Active:
              <input
                #playerActive
                type="checkbox"
                (change)="updatePlayerActive(player, playerActive.checked)"
                [defaultValue]="player.isActive" />
            </div>
          }
        </div>
      }
    </div>
  `,
})
export class PlayerMenuComponent implements OnInit {
  @Input({ required: true }) public players: Player[] = [];
  @Output() public playerSourceChangeEmitter = new EventEmitter<Player[]>();

  private _urlParamService = inject(UrlParamService);

  public isPlayerMenuVisible = false;

  public ngOnInit(): void {
    this.players.forEach(player => {
      this.syncPropsWithUrl(player);
    });
    this.playerSourceChangeEmitter.emit(this.players);
  }

  public playerSourceType = Object.keys(PlayerSourceType).filter(key =>
    isNaN(Number(key))
  );

  public togglePlayerMenu(): void {
    this.isPlayerMenuVisible = !this.isPlayerMenuVisible;
  }

  public updateSources(player: Player, value: string): void {
    player.playerType = value as unknown as PlayerSourceType;

    this._urlParamService.setQueryParam(
      'player-' + player.id + '-source',
      PlayerSourceType[player.playerType]
    );
    this.playerSourceChangeEmitter.emit(this.players);
  }

  public updatePlayerActive(player: Player, value: boolean): void {
    player.isActive = value;

    this._urlParamService.setQueryParam(
      'player-' + player.id + '-active',
      PlayerSourceType[player.playerType]
    );
    this.playerSourceChangeEmitter.emit(this.players);
  }

  //

  private syncPropsWithUrl(player: Player): void {
    setTimeout(() => {
      const source = this._urlParamService.getQueryParam(
        'player-' + player.id + '-source'
      );
      const active = this._urlParamService.getQueryParam(
        'player-' + player.id + '-active'
      );

      if (source !== null) {
        player.playerType = source as PlayerSourceType;
      } else {
        this._urlParamService.setQueryParam(
          'player-' + player.id + '-source',
          PlayerSourceType[player.playerType]
        );
      }

      if (player.isObligatory) return;
      if (active !== null) {
        player.isActive = active === 'true';
      } else {
        this._urlParamService.setQueryParam(
          'player-' + player.id + '-active',
          player.isActive ? 'true' : 'false'
        );
      }
    });
  }
}
