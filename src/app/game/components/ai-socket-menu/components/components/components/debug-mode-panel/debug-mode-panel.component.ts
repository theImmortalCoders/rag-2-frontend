import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { TExchangeData } from '../../../../../../models/exchange-data.type';
import { KeyValuePipe } from '@angular/common';
import { Player } from 'app/game/models/player.class';

@Component({
  selector: 'app-debug-mode-panel',
  standalone: true,
  imports: [KeyValuePipe],
  template: ` @for (variable of inputData | keyvalue; track variable) {
    <div>
      <span>{{ variable.key }}:</span>
      <input
        #variableInput
        class="custom-input w-52"
        type="text"
        [defaultValue]="variable.value" />
      <button
        (click)="emitInputData(variable.key, variableInput.value)"
        class="mt-4 border-b-[1px] border-mainOrange w-full text-center font-black">
        Send
      </button>
    </div>
  }`,
  styles: ``,
})
export class DebugModePanelComponent implements OnInit {
  @Input({ required: true }) public expectedInput: TExchangeData = {};
  @Input({ required: true }) public player!: Player;
  @Output() public inputEmitter = new EventEmitter<TExchangeData>();

  public inputData: TExchangeData = {};

  public ngOnInit(): void {
    this.inputData = JSON.parse(JSON.stringify(this.expectedInput));
  }

  public emitInputData(key: string, value: string): void {
    const data = { [key]: Number(value) } as TExchangeData;
    this.inputEmitter.emit({ player: this.player, data: data });
  }
}
