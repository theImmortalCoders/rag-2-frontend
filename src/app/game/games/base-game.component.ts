import {
  Component,
  EventEmitter,
  Input,
  OnDestroy,
  OnInit,
  Output,
} from '@angular/core';
import { TExchangeData } from '../models/exchange-data.type';
import { Player } from 'app/game/models/player.class';
import { IPlayerInputData } from 'app/game/models/player-input-data.type';
import { Observable, Subscription } from 'rxjs';

@Component({
  selector: 'app-base-game-window',
  standalone: true,
  template: ``,
})
export abstract class BaseGameWindowComponent implements OnInit, OnDestroy {
  @Input({ required: true }) public gameRestart = new Observable<void>();
  @Input({ required: true }) public gamePause = new Observable<boolean>();
  @Input({ required: true }) public players: Player[] = [];
  @Input() public set setSocketInputDataReceive(value: TExchangeData) {
    const playerInputData = this.mapReceivedToPlayerAndData(value);
    if (!playerInputData.data || !playerInputData.player) return;

    this.players.forEach(player => {
      if (player.id === playerInputData.player.id) {
        player.inputData = playerInputData.data;
      }
    });

    this.gameStateData['players'] = JSON.stringify(this.players);
    this.emitOutputData();
  }

  @Output() public gameStateDataEmitter = new EventEmitter<TExchangeData>();

  private _restartSubscription = new Subscription();
  private _pauseSubscription = new Subscription();

  protected isPaused = false;
  protected gameStateData: TExchangeData = {
    players: JSON.stringify(this.players),
  };

  protected arePlayersReady(): boolean {
    return this.players
      .filter(p => p.obligatory)
      .every(player => player != undefined && player.inputData !== undefined);
  }

  public ngOnInit(): void {
    this.restart();
    this._restartSubscription = this.gameRestart.subscribe(() => {
      this.restart();
      console.info('Game restarted');
    });
    this._pauseSubscription = this.gamePause.subscribe(value => {
      this.isPaused = value;
      console.info('Pause state: ', this.isPaused);
    });
    this.gameStateData['players'] = JSON.stringify(this.players);
  }

  public ngOnDestroy(): void {
    this._restartSubscription.unsubscribe();
    this._pauseSubscription.unsubscribe();
  }

  //called on restart (override)
  public abstract restart(): void;

  //send data to data menu (do not override, call when want to send data)
  protected emitOutputData(): void {
    this.gameStateDataEmitter.emit({
      output: this.gameStateData,
    });
  }

  //

  private mapReceivedToPlayerAndData(value: TExchangeData): IPlayerInputData {
    const data = value['data'] as TExchangeData;
    const player = value['player'] as Player;

    return {
      data: data,
      player: player,
    };
  }
}
