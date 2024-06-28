import { Component } from '@angular/core';

@Component({
  selector: 'app-event-menu',
  standalone: true,
  imports: [],
  template: `
    <div class="flex flex-col items-center justify-center space-y-4 pb-4">
      <div class="flex flex-row items-center justify-center space-x-4">
        <label for="socketDomain">Custom AI steering websocket domain</label
        ><input
          placeholder="localhost:8001"
          class="border-mainOrange border-2 px-4 py-1 w-52 bg-mainGray text-mainCreme focus:bg-mainOrange focus:text-mainGray"
          type="text"
          id="socketDomainInput"
          min="3"
          max="50"
          value="" />
        <button
          class="border-mainOrange border-2 p-1 w-52 bg-mainGray text-mainCreme hover:bg-mainOrange hover:text-mainGray"
          id="applySocketDomain">
          Apply
        </button>
      </div>
      <form id="reset-form" method="post">
        <button
          class="border-mainOrange border-2 p-1 w-28 bg-mainGray text-mainCreme hover:bg-mainOrange hover:text-mainGray"
          id="reset">
          Reset
        </button>
      </form>
      <div class="flex flex-row items-center justify-center space-x-4">
        <label for="sendData">Send data?</label>
        <input
          id="sendData"
          type="checkbox"
          class="border-mainOrange border-2 p-1 bg-mainGray text-mainCreme hover:bg-mainOrange hover:text-mainGray checked:bg-mainOrange checked:text-mainGray" />
      </div>
    </div>
  `,
  styles: ``,
})
export class EventMenuComponent {}
