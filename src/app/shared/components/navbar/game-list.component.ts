import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-game-list',
  standalone: true,
  imports: [RouterModule],
  template: `
    <ul class="text-lg space-y-2 px-2 pt-2 pb-4">
      @for (game of games; track game.name) {
        <li class="w-full group">
          <a
            [routerLink]="['game/', game.url]"
            class="flex flex-row justify-between items-center">
            <span>{{ game.name }}</span>
            <i
              data-feather="corner-down-right"
              class="size-5 ease-in-out transition-all duration-500 opacity-0 group-hover:opacity-100"></i>
          </a>
          <hr
            class="border-mainOrange w-2/5 group-hover:w-full ease-in-out transition-all duration-500" />
        </li>
      }
    </ul>
  `,
})
export class GameListComponent {
  public games = [
    { name: 'PONG', url: 'pong' },
    { name: 'TIC TAC TOE', url: 'tictactoe' },
    { name: 'ARKANOID', url: 'arkanoid' },
    { name: 'SNAKE', url: 'snake' },
    { name: 'FLAPPY BIRD', url: 'flappybird' },
    { name: 'SPACE RUSH', url: 'spacerush' },
  ];
}
