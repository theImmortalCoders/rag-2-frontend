import { ApplicationRef, Component, ComponentFactoryResolver, ComponentRef, Injector, Input, OnDestroy } from '@angular/core';
import { TExchangeData } from '@gameModels/exchange-data.type';
import { ExchangeDataPipe } from '@utils/pipes/exchange-data.pipe';
import { ConsoleFieldsetComponent } from './console-fieldset/console-fieldset.component';

@Component({
  selector: 'app-console',
  standalone: true,
  imports: [ExchangeDataPipe, ConsoleFieldsetComponent],
  template: `
    <div class="absolute bottom-0 left-0 w-full z-50">
      <button class="w-full bg-lightGray tracking-[0.15em] sticky z-50 top-0 transition-all ease-in-out duration-700 border-b-2 border-mainOrange hover:border-green-500 text-center py-2 uppercase font-bold font-mono text-xl" 
      (click)="toggleConsole()">
        console
      </button>
      <div
        class="relative w-full max-h-96 transition-all ease-in-out duration-700 bg-lightGray overflow-y-scroll z-50 px-5 {{isConsoleVisible ? ' h-72 py-4' : ' h-0'}}">
        <button (click)="externalConsoleMode()" class="absolute right-4 top-4 flex flex-row space-x-2 justify-end items-center font-mono text-black hover:text-mainCreme transition-all ease-in-out duration-200">
          <span class="uppercase">External console mode</span>
          <i data-feather="external-link" class="size-5"></i>
        </button>
        <app-console-fieldset
          [logData]="logData | exchange_data"
          class="items-start gap-y-6 transition-all ease-in-out duration-700 {{isConsoleVisible ? ' p-10' : ' p-0'}}" />
      </div>
    </div>
  `,
})
export class ConsoleComponent implements OnDestroy{
  @Input({ required: true }) public logData: TExchangeData = {};
  public isConsoleVisible = false;
  
  private _newWindow: Window | null = null;
  private _componentRef: ComponentRef<ConsoleFieldsetComponent> | null = null;
  public constructor(
    private _componentFactoryResolver: ComponentFactoryResolver,
    private _injector: Injector,
    private _appRef: ApplicationRef,
  ) {}

  public ngOnDestroy(): void {
    this._newWindow?.close()
  }

  public toggleConsole(): void {
    this.isConsoleVisible = !this.isConsoleVisible;
  }

  public externalConsoleMode(): void {
    if (this._newWindow && !this._newWindow.closed) {
      this._newWindow.focus();
      return;
    }

    this._newWindow = window.open('', '_blank', 'width=800,height=600');
    if (this._newWindow) {
      this._newWindow.document.body.innerHTML = '<div id="consoleFieldsetRoot"></div>';
      this._newWindow.document.title = 'RAG-2 - External Console Mode';

      const componentFactory = this._componentFactoryResolver.resolveComponentFactory(ConsoleFieldsetComponent);
      this._componentRef = componentFactory.create(this._injector);

      this._componentRef.instance.logData = this.logData;

      this._appRef.attachView(this._componentRef.hostView);

      const hostElement = this._componentRef.location.nativeElement;
      this._newWindow.document.getElementById('consoleFieldsetRoot')?.appendChild(hostElement);
    }
  }
}
