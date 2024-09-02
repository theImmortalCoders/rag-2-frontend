import {
  AfterViewInit,
  Component,
  ElementRef,
  Input,
  ViewChild,
} from '@angular/core';

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
    if (canvas.requestFullscreen) {
      this.saveCanvasContent();
      canvas.requestFullscreen().then(() => {
        this.isFullscreen = true;
        this.resizeCanvasToFullscreen();
        this.restoreCanvasContent();
      });
    }
  }

  private exitFullscreen(): void {
    if (document.exitFullscreen) {
      document.exitFullscreen().then(() => {
        this.isFullscreen = false;
        this.restoreCanvasSize();
        this.restoreCanvasContent();
      });
    }
  }

  private resizeCanvasToFullscreen(): void {
    const canvas = this.canvasElement.nativeElement;
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    this.scaleCanvasContent(
      this._originalWidth,
      this._originalHeight,
      canvas.width,
      canvas.height
    );
  }

  private restoreCanvasSize(): void {
    const canvas = this.canvasElement.nativeElement;
    canvas.width = this._originalWidth;
    canvas.height = this._originalHeight;
  }

  private scaleCanvasContent(
    originalWidth: number,
    originalHeight: number,
    newWidth: number,
    newHeight: number
  ): void {
    const canvas = this.canvasElement.nativeElement;
    const context = canvas.getContext('2d');
    if (context && this._savedImageData) {
      context.clearRect(0, 0, canvas.width, canvas.height);

      const tempCanvas = document.createElement('canvas');
      tempCanvas.width = originalWidth;
      tempCanvas.height = originalHeight;
      const tempContext = tempCanvas.getContext('2d');
      if (tempContext) {
        tempContext.putImageData(this._savedImageData, 0, 0);

        context.drawImage(
          tempCanvas,
          0,
          0,
          originalWidth,
          originalHeight,
          0,
          0,
          newWidth,
          newHeight
        );
      }
    }
  }

  private handleResize(): void {
    if (this.isFullscreen) {
      this.resizeCanvasToFullscreen();
    }
  }

  private addFullscreenEventListeners(): void {
    document.addEventListener('fullscreenchange', () => {
      if (!document.fullscreenElement) {
        this.isFullscreen = false;
        this.restoreCanvasSize();
        this.restoreCanvasContent();
      }
    });
  }

  private saveCanvasContent(): void {
    const canvas = this.canvasElement.nativeElement;
    const context = canvas.getContext('2d');
    if (context) {
      this._savedImageData = context.getImageData(
        0,
        0,
        canvas.width,
        canvas.height
      );
    }
  }

  private restoreCanvasContent(): void {
    const canvas = this.canvasElement.nativeElement;
    const context = canvas.getContext('2d');
    if (context && this._savedImageData) {
      context.putImageData(this._savedImageData, 0, 0);
    }
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
