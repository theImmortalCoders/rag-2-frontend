import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-socket-domain-input',
  standalone: true,
  imports: [],
  template: `
    <input
      class="border-2 border-solid border-black"
      #socketDomain
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
export class SocketDomainInputComponent {
  @Input({ required: true }) public recentPhrases: string[] = [];
  @Output() public socketDomainEmitter = new EventEmitter<string>();
}
