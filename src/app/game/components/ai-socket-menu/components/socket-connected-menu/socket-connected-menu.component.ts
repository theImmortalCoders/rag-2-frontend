import { Component, Input } from '@angular/core';
import { TGameDataSendingType } from '../../../../models/game-data-sending-type.enum';

@Component({
  selector: 'app-socket-connected-menu',
  standalone: true,
  imports: [],
  template: `
    @if (isDataSendingActive) {
      <button #dataCollectingButton (click)="stopDataExchange()">
        Stop data exchange
      </button>
    } @else {
      <input
        type="number"
        #sendingIntervalInput
        class="border-2 border-solid border-black"
        min="10"
        max="1000"
        step="10"
        [defaultValue]="sendingInterval"
        (change)="sendingInterval = sendingIntervalInput.valueAsNumber" />
      <button #dataCollectingButton (click)="startDataExchange()">
        Start data exchange
      </button>
    }
  `,
})
export class SocketConnectedMenuComponent {
  @Input({ required: true }) public isDataSendingActive = false;
  @Input({ required: true }) public sendingInterval = 500;
  @Input({ required: true }) public socket: WebSocket | null = null;

  @Input({ required: true }) public startDataExchange = (): void => {
    console.log('startDataExchange');
  };
  @Input({ required: true }) public stopDataExchange = (): void => {
    console.log('stopDataExchange');
  };
}
