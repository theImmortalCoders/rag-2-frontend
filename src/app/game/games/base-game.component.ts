import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  OnDestroy,
  OnInit,
  Output,
  ViewChild,
  DoCheck,
} from '@angular/core';
import { TExchangeData } from '../models/exchange-data.type';
import { Player } from 'app/game/models/player.class';
import { IPlayerInputData } from 'app/game/models/player-input-data.type';
import { Observable, Subscription } from 'rxjs';
import { CanvasComponent } from '../components/canvas/canvas.component';
import { Game } from '../models/game.class';

@Component({
  selector: 'app-base-game-window',
  standalone: true,
  template: ``,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export abstract class BaseGameWindowComponent
  implements OnInit, OnDestroy, DoCheck
{
  @Input({ required: true }) public gameRestart = new Observable<void>();
  @Input({ required: true }) public gamePause = new Observable<boolean>();
  @Input({ required: true }) public abstractGame!: Game;
  @Input() public set setSocketInputDataReceive(value: TExchangeData) {
    const playerInputData = this.mapReceivedToPlayerAndData(value);
    if (!playerInputData.data || !playerInputData.player) return;

    this.game.players.forEach(player => {
      if (player.id === playerInputData.player.id) {
        player.inputData = playerInputData.data;
      }
    });
  }

  @Output() public gameStateDataEmitter = new EventEmitter<TExchangeData>();
  @ViewChild('gameCanvas') public gameCanvas!: CanvasComponent;

  private _restartSubscription = new Subscription();
  private _pauseSubscription = new Subscription();

  protected isPaused = false;
  protected game: Game = this.abstractGame;

  protected arePlayersReady(): boolean {
    return this.game.players
      .filter(p => p.obligatory)
      .every(player => player != undefined && player.inputData !== undefined);
  }

  public ngOnInit(): void {
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

  public ngDoCheck(): void {
    this.emitGameStateData();
  }

  public abstract restart(): void;

  //

  private emitGameStateData(): void {
    this.gameStateDataEmitter.emit({
      output: this.game || {},
    });
  }

  private mapReceivedToPlayerAndData(value: TExchangeData): IPlayerInputData {
    const data = value['data'] as TExchangeData;
    const player = value['player'] as Player;

    return {
      data: data,
      player: player,
    };
  }
}
