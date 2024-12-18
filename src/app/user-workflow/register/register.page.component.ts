import { Component, inject, OnInit } from '@angular/core';
import { BenefitsListComponent } from '../shared/components/benefits-list/benefits-list.component';
import { SideFormPanelComponent } from '../shared/components/side-form-panel/side-form-panel.component';
import { RegisterFormComponent } from './components/register-form/register-form.component';
import { NotificationService } from 'app/shared/services/notification.service';

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
      class="w-full min-h-screen bg-mainGray items-center lg:items-start flex flex-col lg:flex-row justify-center lg:justify-evenly font-mono pt-12 lg:pt-20 text-mainCreme">
      <app-register-form
        class="w-4/5 xs:w-2/3 lg:w-2/5 h-fit border-2 border-mainOrange rounded-lg px-6 py-8 mb-8" />
      <div
        class="flex flex-col md:flex-row lg:flex-col space-y-4 w-4/5 xs:w-2/3 md:w-4/5 lg:w-1/3 space-x-0 md:space-x-12 lg:space-x-0 h-fit p-6 pt-12 lg:pt-0">
        <app-side-form-panel
          [mainText]="'Do you have an account already?'"
          [buttonText]="'Log in'"
          [routerLink]="'/login'" />
        <app-benefits-list />
      </div>
    </div>
  `,
})
export class RegisterPageComponent implements OnInit {
  private _notificationService = inject(NotificationService);

  public ngOnInit(): void {
    this._notificationService.addNotification(
      'A document containing a detailed description of the methods of processing the provided data is currently being prepared. At this time, by providing their data, the user acknowledges that we cannot guarantee its complete security.'
    );
  }
}
