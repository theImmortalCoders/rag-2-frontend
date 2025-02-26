import { NgOptimizedImage } from '@angular/common';
import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-gest-logo',
  standalone: true,
  imports: [NgOptimizedImage],
  template: `
    <img
      [ngSrc]="
        isEngVersion
          ? 'images/gest/gest_orange_eng.png'
          : 'images/gest/gest_orange.png'
      "
      alt="Logo GEST"
      class="object-contain"
      fill
      [priority]="isPriority" />
  `,
})
export class GestLogoComponent {
  @Input() public isPriority = false;
  @Input() public isEngVersion = false;
}
