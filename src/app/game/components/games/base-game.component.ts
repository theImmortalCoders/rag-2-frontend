import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { TExchangeData } from '../../models/exchange-data.type';
import { Player } from 'app/game/models/player.class';
import { IPlayerInputData } from 'app/game/models/player-input-data.type';

@Component({
  selector: 'app-base-game-window',
  standalone: true,
  template: ``,
})
export abstract class BaseGameWindowComponent implements OnInit {
  protected gameWindowOutputData: TExchangeData = {};

  //call when received data from socket (override)
  @Input() public set setSocketInputDataReceive(value: TExchangeData) {
    this.emitOutputData();
  }
  @Input({ required: true }) public players: Player[] = [];

  @Output() public gameWindowOutputDataEmitter =
    new EventEmitter<TExchangeData>();

  public ngOnInit(): void {
    this.emitOutputData();
  }

  //send data to data menu and socket menu (do not override, call when want to send data)
  protected emitOutputData(): void {
    this.gameWindowOutputDataEmitter.emit({
      output: this.gameWindowOutputData,
    });
  }

  //map received input data to player and data (do not override, call when received data from socket)
  protected mapReceivedToPlayerAndData(value: TExchangeData): IPlayerInputData {
    const data = value['data'] as TExchangeData;
    const player = value['player'] as Player;

    return {
      data: data,
      player: player,
    };
  }
}
