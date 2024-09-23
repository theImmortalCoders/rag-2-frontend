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
import { TExchangeData } from '@gameModels/exchange-data.type';
import { Player } from '@gameModels/player.class';
import { Observable, Subscription } from 'rxjs';
import { CanvasComponent } from '../components/canvas/canvas.component';
import { Game } from '@gameModels/game.class';
import { IPlayerInputData } from '@gameModels/player-input-data.type';

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
  @Input({ required: true }) public set setSocketInputDataReceive(
    value: TExchangeData
  ) {
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
      .filter(p => p.isObligatory)
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

  protected update(): void {
    setTimeout(() => this.update(), 1000 / 60);
  }

  //

  private emitGameStateData(): void {
    this.gameStateDataEmitter.emit({
      state: this.game || {},
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
