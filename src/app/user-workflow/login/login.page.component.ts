import { Component, AfterViewInit } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import * as feather from 'feather-icons';
import { LoginFormComponent } from './components/login-form.component';
import { BenefitsListComponent } from '../shared/components/benefits-list/benefits-list.component';
import { SideFormPanelComponent } from '../shared/components/side-form-panel/side-form-panel.component';

@Component({
  selector: 'app-login-page',
  standalone: true,
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
  imports: [
    ReactiveFormsModule,
    LoginFormComponent,
    BenefitsListComponent,
    SideFormPanelComponent,
  ],
})
export class LoginPageComponent implements AfterViewInit {
  public loginForm = new FormGroup({
    email: new FormControl(''),
    password: new FormControl(''),
  });

  public mainTextValue = "Don't you have an account yet?";

  public ngAfterViewInit(): void {
    feather.replace();
  }

  public submitButton(): void {
    console.log('Email: ', this.loginForm.value.email);
    console.log('Password: ', this.loginForm.value.password);
  }
}
