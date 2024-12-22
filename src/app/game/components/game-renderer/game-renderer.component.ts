/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  Component,
  Input,
  Output,
  EventEmitter,
  DoCheck,
  AfterViewInit,
  ViewChildren,
  QueryList,
} from '@angular/core';
import { Observable } from 'rxjs';
import { Game } from '@gameModels/game.class';
import { TExchangeData } from '@gameModels/exchange-data.type';
import { PongGameWindowComponent } from '@games/pong/pong.component';
import { SkiJumpGameWindowComponent } from '@games/skijump/skijump.component';
import { FlappyBirdGameWindowComponent } from '@games/flappybird/flappybird.component';
import { HappyJumpGameWindowComponent } from '@games/happyjump/happyjump.component';
@Component({
  selector: 'app-game-renderer',
  standalone: true,
  imports: [
    PongGameWindowComponent,
    SkiJumpGameWindowComponent,
    FlappyBirdGameWindowComponent,
    HappyJumpGameWindowComponent,
  ],
  template: `
    @switch (gameName) {
      @case ('pong') {
        <app-pong #pong [setAbstractGame]="game" />
      }
      @case ('skijump') {
        <app-skijump #skijump [setAbstractGame]="game" />
      }
      @case ('flappybird') {
        <app-flappybird #flappybird [setAbstractGame]="game" />
      }
      @case ('happyjump') {
        <app-happyjump #happyjump [setAbstractGame]="game" />
      }
    }
  `,
})
export class GameRendererComponent implements DoCheck, AfterViewInit {
  @Input() public gameName!: string;
  @Input() public game!: Game;
  @Input() public socketInputData!: TExchangeData;
  @Input() public gameRestart!: Observable<void>;
  @Input() public gamePause!: Observable<boolean>;

  @Output() public gameStateDataEmitter = new EventEmitter<Game>();

  @ViewChildren(PongGameWindowComponent)
  public pongComponent!: QueryList<PongGameWindowComponent>;
  @ViewChildren(SkiJumpGameWindowComponent)
  public skiJumpComponent!: QueryList<SkiJumpGameWindowComponent>;
  @ViewChildren(FlappyBirdGameWindowComponent)
  public flappyBirdComponent!: QueryList<FlappyBirdGameWindowComponent>;
  @ViewChildren(HappyJumpGameWindowComponent)
  public happyJumpComponent!: QueryList<HappyJumpGameWindowComponent>;

  private _gameComponentsMap: Record<string, any> = {};

  public ngAfterViewInit(): void {
    this.initializeGameComponents();
    this.updateGameReferences();
  }

  public ngDoCheck(): void {
    this.updateGameReferences();
  }

  private initializeGameComponents(): void {
    this._gameComponentsMap['pong'] = this.pongComponent.toArray();
    this._gameComponentsMap['skijump'] = this.skiJumpComponent.toArray();
    this._gameComponentsMap['flappybird'] = this.flappyBirdComponent.toArray();
    this._gameComponentsMap['happyjump'] = this.happyJumpComponent.toArray();
  }

  private updateGameReferences(): void {
    const components = this._gameComponentsMap[this.gameName];

    if (components && components.length > 0) {
      const game = components[0];
      const classes = 'flex flex-col items-center w-3/4';
      game.el.nativeElement.classList.add(...classes.split(' '));
      game.gameRestart = this.gameRestart;
      game.gamePause = this.gamePause;
      game.setSocketInputDataReceive = this.socketInputData;
      game.gameStateDataEmitter.subscribe((data: Game) => {
        this.gameStateDataEmitter.emit(data);
      });
    }
  }
}
