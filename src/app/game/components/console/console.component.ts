import { Component, Input } from '@angular/core';
import { TExchangeData } from '@gameModels/exchange-data.type';
import { ExchangeDataPipe } from '@utils/pipes/exchange-data.pipe';
import { ConsoleFieldsetComponent } from './console-fieldset/console-fieldset.component';

@Component({
  selector: 'app-console',
  standalone: true,
  imports: [ExchangeDataPipe, ConsoleFieldsetComponent],
  template: `
    <div class="absolute bottom-0 left-0 w-full z-50">
      <button [className]="consoleClasses['button']" (click)="toggleConsole()">
        console
      </button>
      <div
        [className]="
          consoleClasses['consoleContainer'] +
          (isConsoleVisible ? ' h-72 py-4' : ' h-0')
          ">
        <div class="w-full absolute right-4 top-6 flex flex-row space-x-2 justify-end items-center font-mono text-black hover:text-mainCreme transition-all ease-in-out duration-200">
          <span class="uppercase">External console mode</span>
          <i data-feather="external-link" class="size-5"></i>
        </div>
        <app-console-fieldset
          [logData]="logData | exchange_data"
          [className]="
            consoleClasses['consoleFieldset'] +
            (isConsoleVisible ? ' p-10' : ' p-0')
          " />
      </div>
    </div>
  `,
})
export class ConsoleComponent {
  @Input({ required: true }) public logData: TExchangeData = {};
  public isConsoleVisible = false;

  public consoleClasses: TExchangeData = {
    button: `w-full bg-lightGray tracking-[0.15em] sticky z-50 top-0 transition-all ease-in-out duration-700 border-b-2
      border-mainOrange hover:border-green-500 text-center py-2 uppercase font-bold font-mono text-xl cursor-pointer`,
    consoleContainer: `relative w-full max-h-96 transition-all ease-in-out duration-700 bg-lightGray overflow-y-scroll z-50 px-5`,
    consoleFieldset: `items-start gap-y-6 transition-all ease-in-out duration-700`,
  };

  public toggleConsole(): void {
    this.isConsoleVisible = !this.isConsoleVisible;
  }
}
