import { Component } from '@angular/core';
import { LoginFormComponent } from './components/login-form.component';
import { BenefitsListComponent } from '../shared/components/benefits-list/benefits-list.component';
import { SideFormPanelComponent } from '../shared/components/side-form-panel/side-form-panel.component';

@Component({
  selector: 'app-login-page',
  standalone: true,
  imports: [LoginFormComponent, BenefitsListComponent, SideFormPanelComponent],
  template: `
    <div
      class="w-full min-h-screen bg-mainGray flex justify-evenly font-mono pt-20 text-mainCreme">
      <app-login-form
        class="w-1/3 h-fit border-2 border-mainOrange rounded-lg px-6 py-8" />
      <div class="flex flex-col space-y-4 w-1/3 h-fit p-6">
        <app-side-form-panel
          [mainText]="mainTextValue"
          [buttonText]="'Register now'"
          [routerLink]="'/register'" />
        <app-benefits-list />
      </div>
    </div>
  `,
})
export class LoginPageComponent {
  public mainTextValue = "Don't you have an account yet?";
}
