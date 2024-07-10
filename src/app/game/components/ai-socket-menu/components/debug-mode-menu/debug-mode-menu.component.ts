import { Component, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'app-debug-mode-menu',
  standalone: true,
  imports: [],
  template: `
    <input
      type="checkbox"
      #debugCheckbox
      (change)="onDebugModeChange(debugCheckbox.checked)" />
    Debug Mode
  `,
})
export class DebugModeMenuComponent {
  @Output() public debugModeEmitter = new EventEmitter<boolean>();

  public onDebugModeChange(value: boolean): void {
    this.debugModeEmitter.emit(value);
  }
}
