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
  `,
})
export class CanvasComponent implements AfterViewInit {
  @Input({ required: true }) public width!: number;
  @Input({ required: true }) public height!: number;

  @ViewChild('canvasElement', { static: true })
  public canvasElement!: ElementRef<HTMLCanvasElement>;

  public ngAfterViewInit(): void {
    this.initializeCanvas();
  }

  public initializeCanvas(): void {
    const canvas = this.canvasElement.nativeElement;
    const context = canvas.getContext('2d');
    if (context) {
      context.fillStyle = '#151515';
      context.fillRect(0, 0, canvas.width, canvas.height);
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
