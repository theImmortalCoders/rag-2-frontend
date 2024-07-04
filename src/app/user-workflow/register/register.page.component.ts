import { Component } from '@angular/core';
import { BenefitsListComponent } from '../shared/components/benefits-list/benefits-list.component';
import { SideFormPanelComponent } from '../shared/components/side-form-panel/side-form-panel.component';
import { RegisterFormComponent } from './components/register-form.component';

@Component({
  selector: 'app-register-page',
  standalone: true,
  imports: [
    RegisterFormComponent,
    BenefitsListComponent,
    SideFormPanelComponent,
  ],
  template: `
    <div
      class="w-full min-h-screen bg-mainGray flex justify-evenly font-mono pt-20 text-mainCreme">
      <app-register-form
        class="w-1/3 h-fit border-2 border-mainOrange rounded-lg px-6 py-8" />
      <div class="flex flex-col space-y-4 w-1/3 h-fit p-6">
        <app-side-form-panel
          [mainText]="'Do you have an account already?'"
          [buttonText]="'Log in'"
          [routerLink]="'/login'" />
        <app-benefits-list />
      </div>
    </div>
  `,
})
export class RegisterPageComponent {}
