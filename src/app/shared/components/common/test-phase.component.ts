import { Component } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-test-phase',
  standalone: true,
  imports: [MatIconModule],
  template: `
    <div
      class="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50">
      <div
        class="bg-lightGray rounded-lg shadow-lg p-6 text-center border-2 border-mainOrange">
        <div
          class="flex flex-row space-x-2 w-full items-center justify-center pb-4">
          <h1 class="text-2xl text-mainOrange font-semibold uppercase">
            the website is in the testing phase
          </h1>
          <mat-icon class="text-mainOrange text-xl font-thin"
            >settings</mat-icon
          >
        </div>
        <p class="text-mainCreme mb-4">
          The system is currently in the testing phase, and any data we store
          may be deleted without prior notice.
        </p>
        <button
          id="testPhaseButton"
          (click)="acceptTesting()"
          class="px-4 py-2 bg-mainOrange bg-opacity-80 text-mainCreme rounded hover:bg-opacity-100 focus:outline-none ease-in-out duration-200 transition-all">
          I UNDERSTAND
        </button>
      </div>
    </div>
  `,
})
export class TestPhaseComponent {
  public acceptTesting(): void {
    localStorage.setItem('testPhaseAccepted', 'true');
    window.location.reload();
  }
}
