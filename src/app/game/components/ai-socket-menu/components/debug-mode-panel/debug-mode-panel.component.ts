import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { TExchangeData } from '../../../../models/exchange-data.type';
import { KeyValuePipe } from '@angular/common';

@Component({
  selector: 'app-debug-mode-panel',
  standalone: true,
  imports: [KeyValuePipe],
  template: ` @for (variable of input | keyvalue; track variable) {
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
  @Output() public inputEmitter = new EventEmitter<TExchangeData>();

  public input: TExchangeData = {};

  public ngOnInit(): void {
    this.input = JSON.parse(JSON.stringify(this.expectedInput));
  }

  public emitInputData(key: string, value: string): void {
    this.inputEmitter.emit({ [key]: value } as TExchangeData);
  }
}
