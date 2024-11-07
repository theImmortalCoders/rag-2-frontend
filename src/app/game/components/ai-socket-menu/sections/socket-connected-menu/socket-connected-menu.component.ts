import { AfterViewInit, Component, inject, Input, OnInit } from '@angular/core';
import { UrlParamService } from 'app/shared/services/url-param.service';

@Component({
  selector: 'app-socket-connected-menu',
  standalone: true,
  imports: [],
  template: `
    <button
      (click)="socket?.close()"
      class="mt-2 border-b-[1px] border-mainOrange w-full text-center font-black">
      Disconnect
    </button>
    @if (isDataSendingActive) {
      <button
        (click)="stopDataExchange()"
        class="mt-4 text-center text-red-500 font-bold border-red-500 border-[1px]">
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
        (change)="updateValue(sendingIntervalInput.valueAsNumber)" />
      <button
        [attr.disabled]="isPaused ? 'disabled' : null"
        (click)="startDataExchange(vSendingInterval.value)"
        class="mt-4 text-center {{
          !isPaused ? 'text-green-500 font-bold border-green-500' : ''
        }}  border-[1px]">
        Start data exchange
      </button>
    }
  `,
})
export class SocketConnectedMenuComponent implements OnInit {
  @Input({ required: true }) public isDataSendingActive = false;
  @Input({ required: true }) public vSendingInterval = { value: 50 };
  @Input({ required: true }) public socket: WebSocket | null = null;
  @Input({ required: true }) public startDataExchange = (
    sendingInterval: number
  ): void => {
    console.log(sendingInterval);
  };
  @Input({ required: true }) public stopDataExchange = (): void => {
    console.log('stopDataExchange');
  };
  @Input({ required: true }) public isPaused = false;
  @Input({ required: true }) public playerId!: number;

  private _urlParamService = inject(UrlParamService);

  public ngOnInit(): void {
    this.syncPropsWithUrl();
  }

  public updateValue(value: number): void {
    this.vSendingInterval.value = value;

    this._urlParamService.setQueryParam(
      'player-' + this.playerId + '-sending-interval',
      this.vSendingInterval.value.toString()
    );
  }

  //

  private syncPropsWithUrl(): void {
    setTimeout(() => {
      const sendingInterval = this._urlParamService.getQueryParam(
        'player-' + this.playerId + '-sending-interval'
      );
      if (sendingInterval !== null) {
        this.vSendingInterval.value = sendingInterval as unknown as number;
      } else {
        this._urlParamService.setQueryParam(
          'player-' + this.playerId + '-sending-interval',
          this.vSendingInterval.value.toString()
        );
      }
    });
  }
}
