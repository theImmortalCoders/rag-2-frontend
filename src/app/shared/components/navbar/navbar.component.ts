import { NgOptimizedImage } from '@angular/common';
import {
  Component,
  AfterViewInit,
  OnInit,
  OnDestroy,
  HostListener,
} from '@angular/core';
import { Router, NavigationStart, RouterModule } from '@angular/router';
import { GameListComponent } from './sections/game-list/game-list.component';
import { BreakpointObserver, BreakpointState } from '@angular/cdk/layout';
import * as feather from 'feather-icons';
import { Subscription } from 'rxjs';
import { UserShortcutComponent } from './sections/user-shortcut/user-shortcut.component';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [
    RouterModule,
    NgOptimizedImage,
    GameListComponent,
    UserShortcutComponent,
  ],
  template: `
    <nav
      class="bg-mainGray min-w-max pl-3 xs:pl-6 py-4 shadow-navbarShadow relative z-50">
      <div
        class="flex mx-auto w-full flex-row items-center justify-between font-mono text-mainOrange">
        <div class="flex w-fit md:w-1/4 lg:w-1/2 justify-between items-center">
          <a
            [routerLink]="['/']"
            class="size-10 2xs:size-12 relative -rotate-6">
            <img
              ngSrc="images/rag-2.png"
              alt="Logo"
              class="object-contain"
              fill />
          </a>
          <span class="text-3xl hidden md:block">{{
            isMinWidthLg ? 'RUT-AI-GAMES 2.0' : 'RAG-2'
          }}</span>
        </div>
        <div
          class="game-list-container text-xl xs:text-2xl flex flex-col w-3/5 2xs:w-1/2 sm:w-2/5 md:w-[30%] lg:w-1/4 xl:w-1/6 relative items-center justify-center">
          <button
            class="flex flex-row w-full items-center justify-center space-x-1 xs:space-x-2 p-1 relative z-40 border-b-[1px] xs:border-b-2 border-mainOrange hover:border-green-500 ease-in-out transition-all duration-500"
            (click)="toggleGameList()">
            <div
              class="ease-in-out transition-all duration-200 {{
                isGameListActive ? 'rotate-90' : 'rotate-0'
              }}">
              <i data-feather="chevrons-right" class="size-5 xs:size-6"></i>
            </div>
            <span>LET'S PLAY</span>
            <div
              class="ease-in-out transition-all duration-200 {{
                isGameListActive ? '-rotate-90' : 'rotate-0'
              }}">
              <i data-feather="chevrons-left" class="size-5 xs:size-6"></i>
            </div>
          </button>
          <app-game-list
            class="absolute z-20 w-full bg-mainGray ease-in-out transition-all duration-200 shadow-navbarShadow rounded-b-lg {{
              isGameListActive
                ? 'top-[56px] 2xs:top-[60px] xs:top-[64px] opacity-100'
                : '-top-72 opacity-0'
            }}" />
        </div>
        <app-user-shortcut class="flex items-center" />
      </div>
    </nav>
  `,
})
export class NavbarComponent implements AfterViewInit, OnInit, OnDestroy {
  public isGameListActive = false;
  public isMinWidthLg = false;
  private _routerSubscription = new Subscription();
  private _breakpointSubscription = new Subscription();

  public constructor(
    private _breakpointObserver: BreakpointObserver,
    private _router: Router
  ) {
    this._breakpointSubscription = this._breakpointObserver
      .observe(['(min-width: 1024px)'])
      .subscribe((state: BreakpointState) => {
        this.isMinWidthLg = state.matches;
      });
  }

  public ngOnInit(): void {
    this._routerSubscription = this._router.events.subscribe(event => {
      if (event instanceof NavigationStart) {
        this.isGameListActive = false;
      }
    });
  }

  public ngAfterViewInit(): void {
    feather.replace();
  }

  public toggleGameList(): void {
    this.isGameListActive = !this.isGameListActive;
  }

  @HostListener('document:click', ['$event'])
  //marked as unused but it is using by Angular default when click on document :)
  private onDocumentClick(event: MouseEvent): void {
    if (!this.isGameListActive) {
      return;
    }
    const target = event.target as HTMLElement;
    if (target instanceof HTMLElement) {
      const clickedInside = target.closest('.game-list-container');
      if (!clickedInside) {
        this.isGameListActive = false;
      }
    } else {
      this.isGameListActive = false;
    }
  }

  public ngOnDestroy(): void {
    this._routerSubscription.unsubscribe();
    this._breakpointSubscription.unsubscribe();
  }
}
