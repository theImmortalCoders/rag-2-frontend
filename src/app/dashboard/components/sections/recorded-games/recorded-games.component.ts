import { Component } from '@angular/core';

@Component({
  selector: 'app-recorded-games',
  standalone: true,
  imports: [],
  template: `
    <h1 class="text-4xl font-bold text-mainOrange">User recorded games</h1>
    <hr class="w-full border-2 border-mainOrange mb-4" />
    <div class="flex flex-row justify-around space-x-8">
      tabelka z rekordami z gier
    </div>
  `,
})
export class RecordedGamesComponent {}
