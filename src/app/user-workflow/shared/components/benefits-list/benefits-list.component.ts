import { Component, AfterViewInit } from '@angular/core';
import * as feather from 'feather-icons';

@Component({
  selector: 'app-benefits-list',
  standalone: true,
  template: `
    <h1 class="text-lg xs:text-xl pb-6 font-bold uppercase tracking-wider">
      Why is it worth to have an account on RAG-2?
    </h1>
    <div class="flex flex-col space-y-8 text-mainOrange text-sm sm:text-base">
      <span class="flex flex-row items-center space-x-4">
        <i data-feather="save" class="size-6 xs:size-8"></i>
        <p>Save your games</p>
      </span>
      <span class="flex flex-row items-center space-x-4">
        <i data-feather="link" class="size-6 xs:size-8"></i>
        <p>Keep everything together</p>
      </span>
      <span class="flex flex-row items-center space-x-4">
        <i data-feather="package" class="size-6 xs:size-8"></i>
        <p>Watch log's console view</p>
      </span>
      <span class="flex flex-row items-center space-x-4">
        <i data-feather="trending-up" class="size-6 xs:size-8"></i>
        <p>Track your progress</p>
      </span>
    </div>
  `,
})
export class BenefitsListComponent implements AfterViewInit {
  public ngAfterViewInit(): void {
    feather.replace();
  }
}
