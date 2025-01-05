import { NgOptimizedImage } from '@angular/common';
import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-rag-2-logo',
  standalone: true,
  imports: [NgOptimizedImage],
  template: `
    <img
      ngSrc="images/rag-2.png"
      alt="Logo"
      class="object-contain"
      fill
      [priority]="isPriority" />
  `,
})
export class Rag2LogoComponent {
  @Input() public isPriority = false;
}
