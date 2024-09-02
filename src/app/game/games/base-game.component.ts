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
  //called when received data from socket (override)
  @Input() public set setSocketInputDataReceive(value: TExchangeData) {
    this.emitOutputData();
  }
  @Input({ required: true }) public gameRestart = new Observable<void>();
  @Input({ required: true }) public gamePause = new Observable<boolean>();
  @Input({ required: true }) public players: Player[] = [];

  @Output() public gameWindowOutputDataEmitter =
    new EventEmitter<TExchangeData>();

  private _restartSubscription = new Subscription();
  private _pauseSubscription = new Subscription();

  protected gameWindowOutputData: TExchangeData = {};
  protected isPaused = false;

  public ngOnInit(): void {
    this.emitOutputData();
    this.restart();
    this._restartSubscription = this.gameRestart.subscribe(() => {
      this.restart();
      console.info('Game restarted');
    });
    this._pauseSubscription = this.gamePause.subscribe(value => {
      this.isPaused = value;
      console.info('Pause state: ', this.isPaused);
    });
  }

  public ngOnDestroy(): void {
    this._restartSubscription.unsubscribe();
    this._pauseSubscription.unsubscribe();
  }

  //called on reset (override)
  public abstract restart(): void;

  //send data to data menu (do not override, call when want to send data)
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
