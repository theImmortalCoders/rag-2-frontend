import { Component } from '@angular/core';
import { ModalComponent } from '../modal.component';

@Component({
  selector: 'app-admin-settings',
  standalone: true,
  imports: [ModalComponent],
  template: `
    <h1 class="text-4xl font-bold text-mainOrange">Administration settings</h1>
    <hr class="w-full border-2 border-mainOrange mb-4" />
    <div class="flex flex-row justify-around space-x-8">
      <button
        type="button"
        class="flex flex-row items-center justify-center group space-x-2 rounded-lg mt-2 px-3 py-2 bg-mainGray text-mainOrange border-2 border-mainOrange transition-all ease-in-out hover:bg-mainOrange hover:text-mainGray text-base">
        <span>Ban/unban some user</span>
        <i
          data-feather="slash"
          class="text-mainOrange group-hover:text-mainGray transition-all ease-in-out size-4 xs:size-5"></i>
      </button>
      <button
        type="button"
        class="flex flex-row items-center justify-center group space-x-2 rounded-lg mt-2 px-3 py-2 bg-mainGray text-mainOrange border-2 border-mainOrange transition-all ease-in-out hover:bg-mainOrange hover:text-mainGray text-base">
        <span>Change role of some user</span>
        <i
          data-feather="edit"
          class="text-mainOrange group-hover:text-mainGray transition-all ease-in-out size-4 xs:size-5"></i>
      </button>
      <button
        type="button"
        class="flex flex-row items-center justify-center group space-x-2 rounded-lg mt-2 px-3 py-2 bg-mainGray text-mainOrange border-2 border-mainOrange transition-all ease-in-out hover:bg-mainOrange hover:text-mainGray text-base">
        <span>Get details of some user</span>
        <i
          data-feather="eye"
          class="text-mainOrange group-hover:text-mainGray transition-all ease-in-out size-4 xs:size-5"></i>
      </button>
      <button
        type="button"
        class="flex flex-row items-center justify-center group space-x-2 rounded-lg mt-2 px-3 py-2 bg-mainGray text-mainOrange border-2 border-mainOrange transition-all ease-in-out hover:bg-mainOrange hover:text-mainGray text-base">
        <span>Get students lists</span>
        <i
          data-feather="list"
          class="text-mainOrange group-hover:text-mainGray transition-all ease-in-out size-4 xs:size-5"></i>
      </button>
    </div>
    @if (modalVisibility !== null) {
      <app-modal (closeModal)="hideModal()">
        <div class="flex flex-col items-start w-full font-mono">
          <h2 class="text-3xl text-mainCreme font-bold mb-10">
            {{ modalTitle }}
          </h2>

          <button
            class="flex flex-row w-full items-center justify-center group space-x-2 rounded-lg mt-6 px-3 py-2 bg-mainGray text-mainOrange border-2 border-mainOrange transition-all ease-in-out hover:bg-mainOrange hover:text-mainGray text-base"
            (click)="modalButtonFunction()">
            {{ modalButtonText }}
          </button>
          <button
            (click)="hideModal()"
            class="absolute top-2 right-4 text-5xl text-mainOrange hover:text-mainGray">
            x
          </button>
          <div class="text-red-500 mt-6">
            @if (errorMessage !== null) {
              <p>{{ errorMessage }}</p>
            }
          </div>
        </div>
      </app-modal>
    }
  `,
})
export class AdminSettingsComponent {
  public errorMessage: string | null = null;

  public modalVisibility:
    | 'banUnbanUser'
    | 'changeUserRole'
    | 'getUserDetails'
    | 'getStudentsList'
    | null = null;
  public modalTitle = '';
  public modalButtonText = '';
  public modalButtonFunction!: () => void;

  public hideModal(): void {
    this.modalVisibility = null;
  }
}
