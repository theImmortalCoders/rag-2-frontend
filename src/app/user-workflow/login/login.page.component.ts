import { Component } from '@angular/core';
import { LoginFormComponent } from './components/login-form/login-form.component';
import { BenefitsListComponent } from '../shared/components/benefits-list/benefits-list.component';
import { SideFormPanelComponent } from '../shared/components/side-form-panel/side-form-panel.component';

@Component({
  selector: 'app-login-page',
  standalone: true,
  imports: [LoginFormComponent, BenefitsListComponent, SideFormPanelComponent],
  template: `
    <div
      class="w-full min-h-screen bg-mainGray items-center lg:items-start flex flex-col lg:flex-row justify-center lg:justify-evenly font-mono pt-12 lg:pt-20 text-mainCreme">
      <app-login-form
        class="w-4/5 xs:w-2/3 lg:w-1/3 h-fit border-2 border-mainOrange rounded-lg px-6 py-8" />
      <div
        class="flex flex-col md:flex-row lg:flex-col space-y-4 w-4/5 xs:w-2/3 md:w-4/5 lg:w-1/3 space-x-0 md:space-x-12 lg:space-x-0 h-fit p-6 pt-12 lg:pt-0">
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
