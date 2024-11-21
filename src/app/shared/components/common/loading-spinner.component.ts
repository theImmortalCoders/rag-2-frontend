import { Component } from '@angular/core';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

@Component({
  selector: 'app-loading-spinner',
  standalone: true,
  imports: [MatProgressSpinnerModule],
  template: `
    <div class="flex items-center justify-center w-full h-full p-4">
      <mat-spinner strokeWidth="10" diameter="300" color="accent" />
    </div>
  `,
})
export class LoadingSpinnerComponent {}
