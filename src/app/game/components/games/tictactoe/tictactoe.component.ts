import { Component } from '@angular/core';
import { BaseGameWindowComponent } from '../models/base-game.component';

@Component({
  selector: 'app-tictactoe',
  standalone: true,
  imports: [],
  template: ` <p>tictactoe works!</p> `,
})
export class TictactoeGameWindowComponent extends BaseGameWindowComponent {}
