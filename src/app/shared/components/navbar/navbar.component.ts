import { NgOptimizedImage } from '@angular/common';
import { Component, AfterViewInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import { GameListComponent } from './game-list.component';
import * as feather from 'feather-icons';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [RouterModule, NgOptimizedImage, GameListComponent],
  template: `
    <nav
      class="bg-mainGray min-w-max pl-6 py-4 shadow-navbarShadow relative z-50">
      <div
        class="flex mx-auto w-full flex-row items-center justify-between font-mono text-mainOrange">
        <div
          class="flex w-1/2 xs:w-[60%] sm:w-5/12 lg:w-1/3 justify-between items-center">
          <a [routerLink]="['/']" class="size-12 relative">
            <img
              ngSrc="images/rag-2.png"
              alt="Logo"
              class="object-contain"
              fill />
          </a>
          <span class="text-3xl hidden xs:block">RUT-AI-GAMES 2</span>
        </div>
        <div
          class="text-2xl flex flex-col w-1/6 relative items-center justify-center border-b-2 p-1 border-mainOrange cursor-pointer">
          <button
            class="flex flex-row w-full items-center justify-center space-x-2 relative z-40"
            (click)="toggleGameList()">
            <div
              class="ease-in-out transition-all duration-200 {{
                isGameListActive ? '-rotate-90' : 'rotate-0'
              }}">
              <i data-feather="chevrons-down" class="size-6"></i>
            </div>
            <span>LET'S PLAY</span>
            <div
              class="ease-in-out transition-all duration-200 {{
                isGameListActive ? 'rotate-90' : 'rotate-0'
              }}">
              <i data-feather="chevrons-down" class="size-6"></i>
            </div>
          </button>
          <app-game-list
            class="fixed z-20 w-1/6 bg-mainGray ease-in-out transition-all duration-200 {{
              isGameListActive
                ? 'top-[60px] pt-5 opacity-100'
                : 'top-[60px] pt-0 opacity-0'
            }}" />
        </div>
        <a [routerLink]="['/login']" class="mr-10"
          ><i data-feather="users" class="size-9"></i
        ></a>
      </div>
    </nav>
  `,
  styles: ``,
})
export class NavbarComponent implements AfterViewInit {
  public isGameListActive = false;

  public ngAfterViewInit(): void {
    feather.replace();
  }
  public toggleGameList(): void {
    this.isGameListActive = !this.isGameListActive;
  }
}
