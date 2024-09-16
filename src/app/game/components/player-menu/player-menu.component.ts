import { Component, EventEmitter, Input, Output } from '@angular/core';
import { PlayerSourceType } from 'app/shared/models/player-source-type.enum';
import { Player } from '@gameModels/player.class';

@Component({
  selector: 'app-player-menu',
  standalone: true,
  template: `
    <button
      (click)="togglePlayerMenu()"
      class="side-menu-left-button top-0 w-12 h-56 {{
        isPlayerMenuVisible ? 'left-64' : 'left-0'
      }}">
      <span
        class="[writing-mode:vertical-rl] [text-orientation:upright] tracking-[0.45em]"
        >PLAYERS</span
      >
    </button>
    <div
      class="w-64 h-56 overflow-y-auto p-5 bg-lightGray font-mono text-sm side-menu-container top-0 {{
        isPlayerMenuVisible ? 'left-0' : '-left-64'
      }}">
      @for (player of players; track player.id) {
        <div class="flex flex-col space-y-1 pb-2">
          <span class="font-black">{{ player.name }}</span>
          <span>Select player source:</span>
          <select
            #playerSourceSelect
            class="custom-input w-40"
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
export class PlayerMenuComponent {
  @Input({ required: true }) public players: Player[] = [];
  @Output() public playerSourceChangeEmitter = new EventEmitter<Player[]>();

  public isPlayerMenuVisible = false;

  public playerSourceType = Object.keys(PlayerSourceType).filter(key =>
    isNaN(Number(key))
  );

  public togglePlayerMenu(): void {
    this.isPlayerMenuVisible = !this.isPlayerMenuVisible;
  }

  public updateSources(player: Player, value: string): void {
    player.playerType = value as unknown as PlayerSourceType;
    this.playerSourceChangeEmitter.emit(this.players);
  }

  public updatePlayerActive(player: Player, value: boolean): void {
    player.isActive = value;
    this.playerSourceChangeEmitter.emit(this.players);
  }
}
