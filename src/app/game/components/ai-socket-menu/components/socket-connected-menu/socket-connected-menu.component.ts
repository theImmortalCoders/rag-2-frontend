import { Component, Input } from '@angular/core';
import { TGameDataSendingType } from '../../../../models/game-data-sending-type.enum';

@Component({
  selector: 'app-socket-connected-menu',
  standalone: true,
  imports: [],
  template: `
    @if (isDataSendingActive) {
      <button (click)="stopDataExchange()">Stop data exchange</button>
    } @else {
      <input
        type="number"
        #sendingIntervalInput
        class="border-2 border-solid border-black"
        min="10"
        max="1000"
        step="10"
        [defaultValue]="vSendingInterval.value"
        (change)="
          vSendingInterval.value = sendingIntervalInput.valueAsNumber
        " />
      <button (click)="startDataExchange(vSendingInterval.value)">
        Start data exchange
      </button>
    }
  `,
})
export class SocketConnectedMenuComponent {
  @Input({ required: true }) public isDataSendingActive = false;
  @Input({ required: true }) public vSendingInterval = { value: 500 };
  @Input({ required: true }) public socket: WebSocket | null = null;

  @Input({ required: true }) public startDataExchange = (
    sendingInterval: number
  ): void => {
    console.log(sendingInterval);
  };
  @Input({ required: true }) public stopDataExchange = (): void => {
    console.log('stopDataExchange');
  };
}
