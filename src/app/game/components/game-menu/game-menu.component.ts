import { Component, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'app-game-menu',
  standalone: true,
  imports: [],
  template: `
    <button
      (click)="toggleGameMenu()"
      class="side-menu-right-button top-56 w-12 h-36 {{
        isGameMenuVisible ? 'right-64' : 'right-0'
      }}">
      <span
        class="[writing-mode:vertical-rl] [text-orientation:upright] tracking-[0.45em]"
        >GAME</span
      >
    </button>
    <div
      class="w-64 h-36 overflow-y-auto p-5 bg-lightGray font-mono text-sm side-menu-container top-56 {{
        isGameMenuVisible ? 'right-0' : '-right-64'
      }}">
      <button
        (click)="onPauseClick()"
        class="mt-3 py-1 text-blue-900 border-blue-900 border-[1px] hover:bg-blue-900 hover:text-mainCreme transition-all ease-in-out duration-300">
        @if (isPaused) {
          Resume
        } @else {
          Pause
        }
      </button>
      <button
        (click)="onRestartClick()"
        class="mt-3 py-1 text-violet-800 border-violet-800 border-[1px] hover:bg-violet-800 hover:text-mainCreme transition-all ease-in-out duration-300">
        Restart
      </button>
    </div>
  `,
})
export class GameMenuComponent {
  @Output() public pauseEmitter = new EventEmitter<boolean>();
  @Output() public restartEmitter = new EventEmitter<void>();

  public isPaused = false;
  public isGameMenuVisible = false;

  public toggleGameMenu(): void {
    this.isGameMenuVisible = !this.isGameMenuVisible;
  }

  public onPauseClick(): void {
    this.isPaused = !this.isPaused;
    this.pauseEmitter.emit(this.isPaused);
  }

  public onRestartClick(): void {
    this.restartEmitter.emit();
  }
}
