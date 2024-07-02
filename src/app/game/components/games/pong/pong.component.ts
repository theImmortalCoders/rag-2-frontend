import { Component, ElementRef, ViewChild } from '@angular/core';
import { BaseGameWindowComponent } from '../base-game.component';
import { TLogData } from '../../../models/log-data.type';

@Component({
  selector: 'app-pong',
  standalone: true,
  template: `
    PONG
    <input
      class="w-full h-10 border-2 border-gray-300 rounded-lg p-2"
      #inputElement
      type="text"
      (input)="updateInputData(inputElement.value)" />
  `,
})
export class PongGameWindowComponent extends BaseGameWindowComponent {
  public override gameWindowLogData: TLogData = {
    pong: 'Pong Data',
  };

  public updateInputData(value: string): void {
    this.gameWindowLogData['pong'] = value;
  }
}
