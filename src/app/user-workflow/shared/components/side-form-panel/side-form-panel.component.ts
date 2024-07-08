import { Component, Input } from '@angular/core';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-side-form-panel',
  standalone: true,
  imports: [RouterModule],
  template: `
    <h1 class="text-xl xs:text-2xl font-bold uppercase tracking-wider">
      {{ mainText }}
    </h1>
    <span>
      <button
        [routerLink]="[routerLink]"
        class="w-full my-6 border-[1px] border-mainOrange rounded-md px-2 py-1 text-mainOrange transition-all ease-in-out hover:bg-mainOrange hover:text-mainGray">
        {{ buttonText }}
      </button>
    </span>
  `,
})
export class SideFormPanelComponent {
  @Input({ required: true }) public mainText!: string;
  @Input({ required: true }) public routerLink!: string;
  @Input({ required: true }) public buttonText!: string;
}
