import {
  AfterViewInit,
  Component,
  EventEmitter,
  inject,
  OnInit,
  Output,
} from '@angular/core';
import { UrlParamService } from 'app/shared/services/url-param.service';

@Component({
  selector: 'app-game-menu',
  standalone: true,
  imports: [],
  template: `
    <button
      (click)="toggleGameMenu()"
      class="side-menu-right-button top-0 w-12 h-40 {{
        isGameMenuVisible ? 'right-72' : 'right-0'
      }}">
      <span
        class="[writing-mode:vertical-rl] [text-orientation:upright] tracking-[0.45em]"
        >GAME</span
      >
    </button>
    <div
      class="flex flex-col space-y-4 items-center justify-center w-72 h-40 overflow-y-auto p-5 bg-lightGray font-mono text-sm side-menu-container top-0 {{
        isGameMenuVisible ? 'right-0' : '-right-72'
      }}">
      <div class="group font-mono absolute left-0 top-0 z-30">
        <div
          class="absolute z-30 top-3 left-4 rounded-full bg-lightGray group-hover:bg-mainCreme">
          <i
            data-feather="info"
            class="size-5 text-mainGray group-hover:scale-105 transition-all ease-in-out duration-300"></i>
        </div>
        <div
          class="flex absolute z-20 top-3 left-4 h-5 w-[15.75rem] pointer-events-none opacity-0 group-hover:opacity-100 items-start justify-center rounded-l-full rounded-tr-full bg-mainGray text-mainCreme text-nowrap transition-all ease-in-out duration-300">
          <p class="text-center py-[2px] pl-8 pr-4 uppercase text-xs">
            Game menu
          </p>
        </div>
        <div
          class="flex flex-col w-[14.5rem] absolute z-10 top-8 left-9 px-2 pb-2 shadow-menuInfoPanelShadow pointer-events-none opacity-0 group-hover:opacity-100 bg-mainGray text-mainCreme transition-all ease-in-out duration-300">
          <span
            class="text-bold text-2xs text-mainOrange text-justify leading-tight">
            In this menu, you can pause/resume your game, or restart it from the
            beginning.
          </span>
        </div>
      </div>
      <button
        (click)="onPauseClick()"
        class="w-full py-1 font-bold text-blue-900 border-blue-900 border-[1px] hover:bg-blue-900 hover:text-mainCreme transition-all ease-in-out duration-300">
        @if (isPaused) {
          Resume
        } @else {
          Pause
        }
      </button>
      <button
        (click)="onRestartClick()"
        class="w-full py-1 font-bold text-violet-800 border-violet-800 border-[1px] hover:bg-violet-800 hover:text-mainCreme transition-all ease-in-out duration-300">
        Restart
      </button>
    </div>
  `,
})
export class GameMenuComponent implements OnInit {
  @Output() public pauseEmitter = new EventEmitter<boolean>();
  @Output() public restartEmitter = new EventEmitter<void>();

  private _urlParamService = inject(UrlParamService);

  public isPaused = false;
  public isGameMenuVisible = false;

  public ngOnInit(): void {
    setTimeout(() => {
      this.isPaused = this._urlParamService.getQueryParam('paused') === 'true';
      this._urlParamService.setQueryParam(
        'paused',
        this.isPaused ? 'true' : 'false'
      );
      this.pauseEmitter.emit(this.isPaused);
    });
  }

  public toggleGameMenu(): void {
    this.isGameMenuVisible = !this.isGameMenuVisible;
  }

  public onPauseClick(): void {
    this.isPaused = !this.isPaused;

    this._urlParamService.setQueryParam(
      'paused',
      this.isPaused ? 'true' : 'false'
    );
    this.pauseEmitter.emit(this.isPaused);
  }

  public onRestartClick(): void {
    this.restartEmitter.emit();
  }
}
