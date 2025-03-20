import { NgOptimizedImage } from '@angular/common';
import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-prz-logo',
  standalone: true,
  imports: [NgOptimizedImage],
  template: `
    <img
      [ngSrc]="
        isEngVersion
          ? 'images/prz/prz_orange_eng.png'
          : 'images/prz/prz_orange.png'
      "
      alt="Logo PRZ"
      class="object-contain"
      fill
      [priority]="isPriority" />
  `,
})
export class PRzLogoComponent {
  @Input() public isPriority = false;
  @Input() public isEngVersion = false;
}
