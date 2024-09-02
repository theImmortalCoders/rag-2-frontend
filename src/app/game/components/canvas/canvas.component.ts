import {
  AfterViewInit,
  Component,
  ElementRef,
  inject,
  Input,
  ViewChild,
} from '@angular/core';
import { CanvasUtilsService } from './services/canvas-utils.service';

@Component({
  selector: 'app-canvas',
  standalone: true,
  imports: [],
  template: `
    <canvas
      #canvasElement
      [attr.width]="width"
      [attr.height]="height"
      class="border-mainOrange border-2"></canvas>
    <button (click)="toggleFullscreen()">Toggle Fullscreen</button>
  `,
})
export class CanvasComponent implements AfterViewInit {
  @Input({ required: true }) public width!: number;
  @Input({ required: true }) public height!: number;

  private _canvasUtilsService = inject(CanvasUtilsService);

  @ViewChild('canvasElement', { static: true })
  public canvasElement!: ElementRef<HTMLCanvasElement>;

  private isFullscreen = false;
  private _originalWidth!: number;
  private _originalHeight!: number;
  private _savedImageData: ImageData | null = null;

  public ngAfterViewInit(): void {
    this.initializeCanvas();
    this.addFullscreenEventListeners();
    window.addEventListener('resize', this.handleResize.bind(this));
  }

  public initializeCanvas(): void {
    const canvas = this.canvasElement.nativeElement;
    const context = canvas.getContext('2d');
    if (context) {
      context.fillStyle = '#151515';
      context.fillRect(0, 0, canvas.width, canvas.height);
    }
    this._originalWidth = canvas.width;
    this._originalHeight = canvas.height;
  }

  public toggleFullscreen(): void {
    if (!this.isFullscreen) {
      this.enterFullscreen();
    } else {
      this.exitFullscreen();
    }
  }

  private enterFullscreen(): void {
    const canvas = this.canvasElement.nativeElement;
    this._savedImageData = this._canvasUtilsService.saveCanvasContent(canvas);
    this._canvasUtilsService.enterFullscreen(canvas).then(() => {
      this.isFullscreen = true;
      this._canvasUtilsService.resizeCanvasToFullscreen(canvas);
      this._canvasUtilsService.scaleCanvasContent(
        canvas,
        this._savedImageData,
        this._originalWidth,
        this._originalHeight,
        canvas.width,
        canvas.height
      );
    });
  }

  private exitFullscreen(): void {
    this._canvasUtilsService.exitFullscreen().then(() => {
      this.isFullscreen = false;
      const canvas = this.canvasElement.nativeElement;
      this._canvasUtilsService.restoreCanvasSize(
        canvas,
        this._originalWidth,
        this._originalHeight
      );
      this._canvasUtilsService.restoreCanvasContent(
        canvas,
        this._savedImageData
      );
    });
  }

  private handleResize(): void {
    if (this.isFullscreen) {
      const canvas = this.canvasElement.nativeElement;
      this._canvasUtilsService.resizeCanvasToFullscreen(canvas);
      this._canvasUtilsService.scaleCanvasContent(
        canvas,
        this._savedImageData,
        this._originalWidth,
        this._originalHeight,
        canvas.width,
        canvas.height
      );
    }
  }

  private addFullscreenEventListeners(): void {
    document.addEventListener('fullscreenchange', () => {
      if (!document.fullscreenElement) {
        this.isFullscreen = false;
        const canvas = this.canvasElement.nativeElement;
        this._canvasUtilsService.restoreCanvasSize(
          canvas,
          this._originalWidth,
          this._originalHeight
        );
        this._canvasUtilsService.restoreCanvasContent(
          canvas,
          this._savedImageData
        );
      }
    });
  }

  public drawSomething(): void {
    const canvas = this.canvasElement.nativeElement;
    const context = canvas.getContext('2d');
    if (context) {
      context.fillStyle = 'red';
      context.fillRect(10, 10, 100, 100);
    }
  }
}
