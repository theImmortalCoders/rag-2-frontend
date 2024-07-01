import { Component } from '@angular/core';
import { BaseGameWindowComponent as BaseGameWindowComponent } from '../base-game.component';

@Component({
  selector: 'app-pong',
  standalone: true,
  template: `PONG `,
  styles: ``,
})
export class PongGameWindowComponent extends BaseGameWindowComponent {}
