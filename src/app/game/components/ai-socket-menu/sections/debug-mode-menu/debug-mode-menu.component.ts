import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-debug-mode-menu',
  standalone: true,
  imports: [],
  template: `
    <input
      type="checkbox"
      #debugCheckbox
      [attr.disabled]="canApplyDebugMode ? null : true"
      class="mb-2 mr-2 mt-1"
      (change)="onDebugModeChange(debugCheckbox.checked)" />
    <span class="font-bold w-3/4">Debug Mode</span>
  `,
})
export class DebugModeMenuComponent {
  @Input({ required: true }) public canApplyDebugMode = true;
  @Output() public debugModeEmitter = new EventEmitter<boolean>();

  public onDebugModeChange(value: boolean): void {
    this.debugModeEmitter.emit(value);
  }
}
