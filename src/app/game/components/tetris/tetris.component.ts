import { Component } from '@angular/core';
import { BaseGameComponent } from '../base-game/base-game.component';

@Component({
  selector: 'app-tetris',
  standalone: true,
  imports: [BaseGameComponent],
  template: `
    <p>tetris works!</p>
    <app-base-game [menuType]="'EVENT'"></app-base-game>
  `,
  styles: ``,
})
export class TetrisComponent extends BaseGameComponent {}
