import { Component, EventEmitter, Input, Output } from '@angular/core';
import { PlayerSourceType } from 'app/game/models/player-source-type.enum';
import { Player } from 'app/game/models/player.class';

@Component({
  selector: 'app-player-menu',
  standalone: true,
  template: `
    <div>
      Players menu
      @for (player of players; track player.id) {
        <div>{{ player.name }}</div>
        Select player source:
        <select
          #playerSourceSelect
          [attr.disabled]="!player.active ? 'disabled' : null"
          (change)="updateSources(player, playerSourceSelect.value)">
          @for (source of playerSourceType; track source) {
            <option [value]="source" [selected]="source === player.playerType">
              {{ source }}
            </option>
          }
        </select>
        @if (!player.obligatory) {
          <div>
            Active:
            <input
              #playerActive
              type="checkbox"
              (change)="updatePlayerActive(player, playerActive.checked)"
              [defaultValue]="player.active" />
          </div>
        }
      }
    </div>
  `,
})
export class PlayerMenuComponent {
  @Input({ required: true }) public players: Player[] = [];
  @Output() public playerSourceChangeEmitter = new EventEmitter<Player[]>();

  public playerSourceType = Object.keys(PlayerSourceType).filter(key =>
    isNaN(Number(key))
  );

  public updateSources(player: Player, value: string): void {
    player.setPlayerType = value as unknown as PlayerSourceType;
    this.playerSourceChangeEmitter.emit(this.players);
  }

  public updatePlayerActive(player: Player, value: boolean): void {
    player.active = value;
    this.playerSourceChangeEmitter.emit(this.players);
  }
}
