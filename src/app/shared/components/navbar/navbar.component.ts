import { NgOptimizedImage } from '@angular/common';
import { Component, AfterViewInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import { GameListComponent } from './game-list.component';
import { BreakpointObserver, BreakpointState } from '@angular/cdk/layout';
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
        <div class="flex w-1/4 lg:w-1/2 justify-between items-center">
          <a [routerLink]="['/']" class="size-12 relative -rotate-6">
            <img
              ngSrc="images/rag-2.png"
              alt="Logo"
              class="object-contain"
              fill />
          </a>
          <span class="text-3xl hidden xs:block">{{
            isMinWidthLg ? 'RUT-AI-GAMES 2' : 'RAG-2'
          }}</span>
        </div>
        <div
          class="text-2xl flex flex-col w-[30%] lg:w-1/4 xl:w-1/6 relative items-center justify-center">
          <button
            class="flex flex-row w-full items-center justify-center space-x-2 p-1 relative z-40 border-b-2 border-mainOrange hover:border-green-500"
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
            class="absolute z-20 w-full bg-mainGray ease-in-out transition-all duration-200 shadow-navbarShadow rounded-b-lg {{
              isGameListActive ? 'top-[64px] opacity-100' : '-top-72 opacity-0'
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
  public isMinWidthLg = false;

  public constructor(private _breakpointObserver: BreakpointObserver) {
    this._breakpointObserver
      .observe(['(min-width: 1024px)'])
      .subscribe((state: BreakpointState) => {
        this.isMinWidthLg = state.matches;
      });
  }

  public ngAfterViewInit(): void {
    feather.replace();
  }
  public toggleGameList(): void {
    this.isGameListActive = !this.isGameListActive;
  }
}
