import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { TExchangeData } from '../../../../models/exchange-data.type';
import { KeyValuePipe } from '@angular/common';

@Component({
  selector: 'app-debug-mode-panel',
  standalone: true,
  imports: [KeyValuePipe],
  template: ` @for (variable of input | keyvalue; track variable) {
    <div>
      {{ variable.key }}:
      <input
        #variableInput
        class="border-2 border-black border-solid"
        type="text"
        [defaultValue]="variable.value" />
      <button (click)="emitInputData(variable.key, variableInput.value)">
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
