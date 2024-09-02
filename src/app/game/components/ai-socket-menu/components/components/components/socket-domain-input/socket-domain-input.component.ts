import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-socket-domain-input',
  standalone: true,
  imports: [],
  template: `
    <input
      class="custom-input w-52 my-2"
      #socketDomain
      placeholder="localhost:8001"
      type="text"
      (change)="socketDomainEmitter.emit(socketDomain.value)"
      list="recentPhrases" />
    <datalist id="recentPhrases">
      @for (phrase of recentPhrases; track phrase) {
        <option [value]="phrase"></option>
      }
    </datalist>
  `,
  styles: ``,
})
export class SocketDomainInputComponent implements OnInit {
  @Input({ required: true }) public gameName = '';
  @Output() public socketDomainEmitter = new EventEmitter<string>();
  @Output() public recentPhrasesEmitter = new EventEmitter<string[]>();

  public recentPhrases: string[] = [];

  public ngOnInit(): void {
    this.loadRecentPhrases();
  }

  private loadRecentPhrases(): void {
    const cachedPhrases = localStorage.getItem(
      'recentPhrases_' + this.gameName
    );
    if (cachedPhrases) {
      this.recentPhrases = JSON.parse(cachedPhrases);
    }
    this.recentPhrasesEmitter.emit(this.recentPhrases);
  }
}
