import { Component, Input, OnChanges } from '@angular/core';

@Component({
  selector: 'app-progress-circle-bar',
  standalone: true,
  imports: [],
  template: `
    <div class="relative w-64 h-64 flex items-center justify-center">
      <svg class="w-full h-full" viewBox="0 0 64 64">
        <path
          class="text-lightGray"
          stroke-width="4"
          stroke="currentColor"
          fill="none"
          d="M32 4
         a 28 28 0 1 0 0 56
         a 28 28 0 1 0 0 -56" />
        <path
          class="text-mainOrange"
          stroke-width="4"
          [attr.stroke-dasharray]="fillAmount + ', ' + circumference"
          stroke-linecap="round"
          stroke="currentColor"
          fill="none"
          transform="rotate(-90 32 32)"
          d="M32 4
         a 28 28 0 1 0 0 56
         a 28 28 0 1 0 0 -56" />
      </svg>
      <div
        class="flex flex-col items-center justify-center absolute text-2xl font-bold text-mainCreme">
        <span>{{ usedSpace }}/{{ totalSpace }} MB</span>
        <span class="text-center text-wrap">used of your</span>
        <span class="text-center text-wrap">disk space</span>
      </div>
    </div>
  `,
})
export class ProgressCircleBarComponent implements OnChanges {
  @Input({ required: true }) public usedSpace!: number;
  @Input({ required: true }) public totalSpace!: number;

  public radius = 28;
  public circumference = 2 * Math.PI * this.radius;
  public fillAmount = 0;

  public ngOnChanges(): void {
    this.usedSpace = Math.min(this.usedSpace, this.totalSpace);
    this.fillAmount = (this.circumference * this.usedSpace) / this.totalSpace;
  }
}
