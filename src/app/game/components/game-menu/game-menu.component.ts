import { Component, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'app-game-menu',
  standalone: true,
  imports: [],
  template: `
    <div class="absolute left-0 flex flex-col items-start bottom-60">
      <button (click)="onPauseClick()">
        @if (isPaused) {
          Resume
        } @else {
          Pause
        }
      </button>
      <button (click)="onRestartClick()">Restart</button>
    </div>
  `,
})
export class GameMenuComponent {
  @Output() public pauseEmitter = new EventEmitter<boolean>();
  @Output() public restartEmitter = new EventEmitter<void>();

  public isPaused = false;

  public onPauseClick(): void {
    this.isPaused = !this.isPaused;
    this.pauseEmitter.emit(this.isPaused);
  }

  public onRestartClick(): void {
    this.isPaused = false;
    this.pauseEmitter.emit(this.isPaused);
    this.restartEmitter.emit();
  }
}
