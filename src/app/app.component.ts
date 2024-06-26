import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet],
  template: '<div class="text-red-600">{{title}}</div> ',
})
export class AppComponent {
  public title = 'rag-2-frontend';
}
