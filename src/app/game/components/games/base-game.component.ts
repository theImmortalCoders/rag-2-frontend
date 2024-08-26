import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { TExchangeData } from '../../models/exchange-data.type';
import { Player } from 'app/game/models/player.class';

@Component({
  selector: 'app-base-game-window',
  standalone: true,
  template: ``,
})
export abstract class BaseGameWindowComponent implements OnInit {
  protected gameWindowOutputData: TExchangeData = {};

  //called when received data from socket
  @Input() public set setSocketInputDataReceive(value: TExchangeData) {
    this.emitOutputData();
  }
  @Input({ required: true }) public players: Player[] = [];

  @Output() public gameWindowOutputDataEmitter =
    new EventEmitter<TExchangeData>();

  public ngOnInit(): void {
    this.emitOutputData();
  }

  //send data to data menu and socket menu
  protected emitOutputData(): void {
    this.gameWindowOutputDataEmitter.emit({
      output: this.gameWindowOutputData,
    });
  }
}
