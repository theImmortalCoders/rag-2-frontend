import { Component } from '@angular/core';
import { BaseGameComponent } from '../base-game/base-game.component';

@Component({
  selector: 'app-pong',
  standalone: true,
  template: `
    <p>pong works!</p>
    <app-base-game [menuType]="'TIME'"></app-base-game>
  `,
  styles: ``,
  imports: [BaseGameComponent],
})
export class PongComponent extends BaseGameComponent {}
