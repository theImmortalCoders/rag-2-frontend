import { Component, Input } from '@angular/core';
import { TGameDataSendingType } from '../../../../models/game-data-sending-type.enum';

@Component({
  selector: 'app-socket-connected-menu',
  standalone: true,
  imports: [],
  template: `
    @if (isDataSendingActive) {
      <button
        (click)="stopDataExchange()"
        class="mt-4 text-center text-red-500 border-red-500 border-[1px]">
        Stop data exchange
      </button>
    } @else {
      <input
        type="number"
        #sendingIntervalInput
        class="custom-input w-52 mb-2"
        min="10"
        max="1000"
        step="10"
        [defaultValue]="vSendingInterval.value"
        (change)="
          vSendingInterval.value = sendingIntervalInput.valueAsNumber
        " />
      <button
        (click)="startDataExchange(vSendingInterval.value)"
        class="mt-4 text-center text-green-500 border-red-500 border-[1px]">
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
