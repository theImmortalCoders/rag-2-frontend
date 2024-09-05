import { Component, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'app-debug-mode-menu',
  standalone: true,
  imports: [],
  template: `
    <input
      type="checkbox"
      #debugCheckbox
      class="mb-2 mr-2"
      (change)="onDebugModeChange(debugCheckbox.checked)" />
    <span class="font-bold w-3/4">Debug Mode</span>
  `,
})
export class DebugModeMenuComponent {
  @Output() public debugModeEmitter = new EventEmitter<boolean>();

  public onDebugModeChange(value: boolean): void {
    this.debugModeEmitter.emit(value);
  }
}
