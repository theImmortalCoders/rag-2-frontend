import { Component } from '@angular/core';

@Component({
  selector: 'app-modal',
  standalone: true,
  imports: [],
  template: `
    <div
      class="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div
        class="bg-white rounded-lg p-6 w-2/3 h-3/4 shadow-lg relative"
        role="dialog"
        aria-modal="true">
        <ng-content></ng-content>
      </div>
    </div>
  `,
})
export class ModalComponent {}
