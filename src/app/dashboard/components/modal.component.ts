import { Component, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-modal',
  standalone: true,
  template: `
    <button
      class="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50"
      (click)="onBackdropClick()">
      <button
        class="flex flex-col bg-lightGray border-2 border-mainOrange rounded-lg p-6 w-2/3 h-2/3 shadow-lg relative"
        role="dialog"
        aria-modal="true"
        (click)="$event.stopPropagation()">
        <ng-content></ng-content>
      </button>
    </button>
  `,
})
export class ModalComponent {
  @Output() public closeModal = new EventEmitter<void>();

  public onBackdropClick(): void {
    this.closeModal.emit();
  }
}
