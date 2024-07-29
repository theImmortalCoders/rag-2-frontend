import { Component } from '@angular/core';

@Component({
  selector: 'app-game-list',
  standalone: true,
  imports: [],
  template: `
    <ul class="text-lg space-y-2 px-2 pb-2">
      <li>PONG</li>
      <li>TIC TAC TOE</li>
      <li>ARKANOID</li>
      <li>SNAKE</li>
      <li>FLAPPY BIRD</li>
      <li>SPACE RUSH</li>
    </ul>
  `,
})
export class GameListComponent {}
