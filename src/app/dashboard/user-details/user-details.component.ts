import {
  AfterViewInit,
  ChangeDetectorRef,
  Component,
  inject,
  OnInit,
} from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-user-details',
  standalone: true,
  imports: [],
  template: ` <p class="text-7xl">user-details works!</p> `,
})
export class UserDetailsComponent implements OnInit {
  private _route = inject(ActivatedRoute);

  public userId!: string;

  public ngOnInit(): void {
    this._route.params.subscribe(params => {
      this.userId = params['id'];
      console.log('User ID:', this.userId);

      //pobrac tu dane usera
    });
  }
}
