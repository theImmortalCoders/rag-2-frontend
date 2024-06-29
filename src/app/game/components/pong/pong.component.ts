import { Component } from '@angular/core';
import { BaseGameComponent } from '../base-game/base-game.component';

@Component({
  selector: 'app-pong',
  standalone: true,
  imports: [BaseGameComponent],
  template: ` <app-base-game [menuType]="'TIME'"></app-base-game> `,
  styles: ``,
})
export class PongComponent extends BaseGameComponent {}
