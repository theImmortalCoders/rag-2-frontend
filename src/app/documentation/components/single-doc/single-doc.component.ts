import { formatFileSize } from '@utils/helpers/formatFileSize';
import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-single-doc',
  standalone: true,
  imports: [],
  template: `
    <div class="flex flex-row space-x-4 w-full items-center justify-center">
      <span
        class="text-3xl text-mainCreme font-bold tracking-wider text-center"
        >{{ header }}</span
      >
      <i [attr.data-feather]="icon" class="text-mainCreme size-6"></i>
    </div>
    <span class="text-justify text-mainCreme">{{ description }}</span>
    <button
      [disabled]="!isAvailable"
      (click)="downloadFile()"
      class="{{
        isAvailable ? 'opacity-100' : 'opacity-40 pointer-events-none'
      }} w-full border-[1px] border-mainOrange py-2 px-4 bg-mainGray text-mainOrange font-bold text-center hover:bg-mainOrange hover:text-mainGray ease-in-out transition-all duration-300">
      {{ buttonText }}
    </button>
  `,
})
export class SingleDocComponent implements OnInit {
  @Input({ required: true }) public header!: string;
  @Input({ required: true }) public description!: string;
  @Input({ required: true }) public icon!: string;
  @Input({ required: false }) public fileName!: string;
  @Input({ required: false }) public isAvailable!: boolean;

  public buttonText = '';
  public fileExtension = '';
  public fileSize = '';

  public async ngOnInit(): Promise<void> {
    if (this.fileName) {
      this.fileExtension = (this.fileName.split('.').pop() || '').toUpperCase();
      await this.getFileSize(this.fileName);
    }

    this.buttonText = this.isAvailable
      ? `DOWNLOAD (${this.fileExtension}, ${this.fileSize ? this.fileSize : 'Unknown'})`
      : 'IN PROGRESS';
  }

  public async getFileSize(url: string): Promise<void> {
    try {
      const response = await fetch(url, { method: 'HEAD' });
      const contentLength = response.headers.get('Content-Length');
      if (contentLength) {
        this.fileSize = formatFileSize(parseInt(contentLength, 10));
      } else {
        console.error('Unable to get file size');
      }
    } catch (error) {
      console.error('Error fetching file size:', error);
    }
  }

  public downloadFile(): void {
    if (!this.fileName) {
      console.error('No file name detected');
      return;
    }

    const link = document.createElement('a');
    link.href = this.fileName;
    link.download = this.fileName.split('/').pop() as string;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }
}
