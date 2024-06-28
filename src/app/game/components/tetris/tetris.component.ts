import { Component } from '@angular/core';
import { BaseGameComponent } from '../base-game/base-game.component';

@Component({
  selector: 'app-tetris',
  standalone: true,
  imports: [],
  template: ` <p>tetris works!</p> `,
  styles: ``,
})
export class TetrisComponent extends BaseGameComponent {}
