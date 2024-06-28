import { Component, Input, Type, OnInit } from '@angular/core';
import { TMenuType } from '../../models/menu-type.enum';
import { TimeMenuComponent } from '../menu/time-menu.component';
import { EventMenuComponent } from '../menu/event-menu.component';
import { NgComponentOutlet } from '@angular/common';

const menuTypeComponents: Record<
  TMenuType,
  Type<TimeMenuComponent | EventMenuComponent>
> = {
  TIME: TimeMenuComponent,
  EVENT: EventMenuComponent,
};

@Component({
  selector: 'app-base-game',
  standalone: true,
  imports: [NgComponentOutlet],
  template: `
    <div
      class="flex w-full min-h-screen items-center justify-center bg-lightGray pt-4 pb-12 font-mono">
      <div
        class="flex flex-col items-center justify-center h-full mt-4 w-[70%] space-y-4">
        <div class="flex flex-row items-center justify-center space-x-4">
          <button
            class="border-mainOrange border-2 p-1 w-28 hover:bg-mainOrange hover:text-mainGray"
            id="pvai">
            PvAI
          </button>
          <button
            class="border-mainOrange border-2 p-1 w-28 hover:bg-mainOrange hover:text-mainGray"
            id="pvp">
            PvP
          </button>
        </div>
        @if (component) {
          <ng-container *ngComponentOutlet="component"></ng-container>
        }
        <!-- <canvas id="game" class="block"></canvas> -->
      </div>
    </div>
  `,
  styles: ``,
})
export class BaseGameComponent implements OnInit {
  @Input({ required: true }) public menuType!: TMenuType;

  public component: Type<unknown> | null = null;

  public ngOnInit(): void {
    this.component = menuTypeComponents[this.menuType] || null;
  }
}
