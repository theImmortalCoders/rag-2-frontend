import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-socket-domain-input',
  standalone: true,
  imports: [],
  template: `
    <input
      class="custom-input w-52 mb-2"
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
export class SocketDomainInputComponent {
  @Input({ required: true }) public recentPhrases: string[] = [];
  @Output() public socketDomainEmitter = new EventEmitter<string>();
}
