import { KeyValuePipe } from '@angular/common';
import { Component, EventEmitter, Input, Output, OnInit } from '@angular/core';
import { TExchangeData } from 'app/game/models/exchange-data.type';
import { PlayerSourceType } from 'app/game/models/player-source-type.enum';
import { Player } from 'app/game/models/player.class';

@Component({
  selector: 'app-player-menu',
  standalone: true,
  imports: [KeyValuePipe],
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
            <option [value]="source">
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
export class PlayerMenuComponent implements OnInit {
  @Input({ required: true }) public players: Player[] = [];
  @Output() public playerSourceChangeEmitter = new EventEmitter<Player[]>();
  public playerSourceType = Object.keys(PlayerSourceType).filter(key =>
    isNaN(Number(key))
  );
  @Output() public logDataEmitter = new EventEmitter<TExchangeData>();
  public logData: TExchangeData = {};

  public ngOnInit(): void {
    this.logData['players'] = this.players;
    this.logDataEmitter.emit(this.logData);
  }

  public updateSources(player: Player, value: string): void {
    player.setPlayerType = value as unknown as PlayerSourceType;
    this.logDataEmitter.emit(this.logData);
    this.playerSourceChangeEmitter.emit(this.players);
  }

  public updatePlayerActive(player: Player, value: boolean): void {
    player.active = value;
    this.logDataEmitter.emit(this.logData);
    this.playerSourceChangeEmitter.emit(this.players);
  }
}
