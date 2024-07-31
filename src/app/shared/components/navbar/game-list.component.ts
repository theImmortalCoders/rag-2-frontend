import { Component } from '@angular/core';

@Component({
  selector: 'app-game-list',
  standalone: true,
  imports: [],
  template: `
    <ul class="text-lg space-y-2 px-2 pb-4">
      <li class="w-full group">
        <span>PONG</span>
        <hr class="{{ liStyle }}" />
      </li>
      <li class="w-full group">
        <span>TIC TAC TOE</span>
        <hr class="{{ liStyle }}" />
      </li>
      <li class="w-full group">
        <span>ARKANOID</span>
        <hr class="{{ liStyle }}" />
      </li>
      <li class="w-full group">
        <span>SNAKE</span>
        <hr class="{{ liStyle }}" />
      </li>
      <li class="w-full group">
        <span>FLAPPY BIRD</span>
        <hr class="{{ liStyle }}" />
      </li>
      <li class="w-full group">
        <span>SPACE RUSH</span>
        <hr class="{{ liStyle }} durat" />
      </li>
    </ul>
  `,
})
export class GameListComponent {
  public liStyle =
    'border-mainOrange w-2/5 group-hover:w-full ease-in-out transition-all duration-500';
}
