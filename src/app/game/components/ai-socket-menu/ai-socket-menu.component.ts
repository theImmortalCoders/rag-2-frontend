import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { TExchangeData } from '../../models/exchange-data.type';
import { ILoggableDataComponent } from '../../models/loggable-data-component';

@Component({
  selector: 'app-ai-socket-menu',
  standalone: true,
  imports: [],
  template: `
    <div class=" border-2 border-solid border-red-600 p-5">
      <input
        class="border-2 border-solid border-black"
        #socketDomain
        type="text"
        list="recentPhrases" />
      <datalist id="recentPhrases">
        @for (phrase of recentPhrases; track phrase) {
          <option [value]="phrase"></option>
        }
      </datalist>
      <div [textContent]="socketStatus"></div>
      <button (click)="connect(socketDomain.value)">Connect</button>
      <button (click)="socket?.close()">Disconnect</button>
      <button (click)="send()">Send</button>
    </div>
  `,
})
export class AiSocketMenuComponent implements OnInit, ILoggableDataComponent {
  @Output() public logDataEmitter = new EventEmitter<TExchangeData>();

  public logData: TExchangeData = {};
  public socket: WebSocket | null = null;
  public recentPhrases: string[] = [];
  public socketStatus = 'Disconnected';

  public ngOnInit(): void {
    this.logDataEmitter.emit(this.logData);
    this.loadRecentPhrases();
  }

  public connect(socketDomain: string): void {
    this.socket = new WebSocket(socketDomain);
    this.socket.addEventListener('open', () => {
      this.socketStatus = 'Connected';
      this.saveRecentPhrase(socketDomain);
    });
    this.socket.addEventListener('message', event => {
      console.log('Received message:', event.data);
    });
    this.socket.addEventListener('close', () => {
      this.socketStatus = 'Disconnected';
    });
  }

  public send(): void {
    if (this.socket) {
      this.socket.send(JSON.stringify({ message: 'Hello, World!' }));
    }
  }

  //

  private loadRecentPhrases(): void {
    const cachedPhrases = localStorage.getItem('recentPhrases');
    if (cachedPhrases) {
      this.recentPhrases = JSON.parse(cachedPhrases);
    }
  }

  private saveRecentPhrase(phrase: string): void {
    if (!this.recentPhrases.includes(phrase)) {
      this.recentPhrases.unshift(phrase);
      if (this.recentPhrases.length > 5) {
        this.recentPhrases.pop();
      }
      localStorage.setItem('recentPhrases', JSON.stringify(this.recentPhrases));
    }
  }
}
