import { NgOptimizedImage } from '@angular/common';
import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-prz-logo',
  standalone: true,
  imports: [NgOptimizedImage],
  template: `
    <img
      ngSrc="images/prz_orange.png"
      alt="Logo PRZ"
      class="object-contain"
      fill
      [priority]="isPriority" />
  `,
})
export class PRzLogoComponent {
  @Input() public isPriority = false;
}
