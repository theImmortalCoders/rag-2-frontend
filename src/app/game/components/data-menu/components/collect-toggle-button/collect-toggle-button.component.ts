import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-data-collecting-toggle-button',
  standalone: true,
  template: `
    <button
      (click)="vIsDataCollectingActive.value = !vIsDataCollectingActive.value">
      @if (!vIsDataCollectingActive.value) {
        Start collecting data
      } @else {
        Stop collecting data
      }
    </button>
  `,
})
export class DataCollectingToggleButtonComponent {
  @Input({ required: true }) public vIsDataCollectingActive = { value: false };
}
