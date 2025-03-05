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
import { SideMenuHelperComponent } from '../ai-socket-menu/sections/side-menu-helper/side-menu-helper.component';

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
      <app-side-menu-helper
        [menuType]="'Data menu'"
        [descriptionPart1]="
          'In this menu, you can choose each players control source. If you choose WebSocket control for at least one player, an additional menu will appear.'
        "
        [descriptionPart2]="null"
        [descriptionPart3]="null" />
      @for (player of players; track player.id) {
        <div
          class="flex flex-col space-y-1 pb-2 {{ $first ? 'mt-4' : 'mt-0' }}">
          <div class="flex flex-row space-x-2">
            @if (editedPlayerId === player.id) {
              <input
                #playerName
                class="custom-input-small text-lg"
                type="text"
                [value]="player.name"
                (change)="setEditedPlayerName(playerName.value)"
                (keydown)="setEditedPlayerName(playerName.value)" />
            } @else {
              <span class="text-mainOrange text-xl font-bold uppercase">{{
                player.name
              }}</span>
            }
            <button
              (click)="
                setEditedPlayerId(player.id); setEditedPlayerName(player.name)
              "
              class="flex items-center justify-center border-[1px] border-mainGray rounded-md px-[6px] group hover:bg-mainCreme transition-all ease-in-out duration-300">
              <i
                data-feather="edit-3"
                class="size-3 text-mainCreme group-hover:text-darkGray transition-all ease-in-out duration-300"></i>
            </button>
          </div>
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
                id="playerActive"
                type="checkbox"
                class="accent-mainOrange"
                (change)="updatePlayerActive(player, playerActive.checked)"
                [defaultValue]="player.isActive" />
            </div>
          }
        </div>
      }
    </div>
  `,
  imports: [SideMenuHelperComponent],
})
export class PlayerMenuComponent implements OnInit {
  @Input({ required: true }) public players: Player[] = [];
  @Output() public playerSourceChangeEmitter = new EventEmitter<Player[]>();

  private _urlParamService = inject(UrlParamService);

  public isPlayerMenuVisible = false;

  public editedPlayerId = -1;
  public editedPlayerName = '';

  public ngOnInit(): void {
    this.players.forEach(player => {
      this.syncPropsWithUrl(player);
    });
    this.playerSourceChangeEmitter.emit(this.players);
  }

  public playerSourceType = Object.keys(PlayerSourceType).filter(key =>
    isNaN(Number(key))
  );

  public setEditedPlayerId(id: number): void {
    if (this.editedPlayerId === id) {
      this.editedPlayerId = -1;
      console.log(this.editedPlayerName);
    } else {
      this.editedPlayerId = id;
    }
  }

  public setEditedPlayerName(name: string): void {
    this.editedPlayerName = name;
  }

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
