import { BreakpointObserver, BreakpointState } from '@angular/cdk/layout';
import { Component, OnDestroy } from '@angular/core';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-loading-spinner',
  standalone: true,
  imports: [MatProgressSpinnerModule],
  template: `
    <div class="flex items-center justify-center w-full h-full p-4">
      <mat-spinner
        [strokeWidth]="getStrokeWidth()"
        [diameter]="getDiameter()"
        color="accent" />
    </div>
  `,
})
export class LoadingSpinnerComponent implements OnDestroy {
  private _breakpointSubscription = new Subscription();

  public isMinWidthSm = false;

  public constructor(private _breakpointObserver: BreakpointObserver) {
    this._breakpointSubscription = this._breakpointObserver
      .observe(['(min-width: 640px)'])
      .subscribe((state: BreakpointState) => {
        this.isMinWidthSm = state.matches;
      });
  }

  public getStrokeWidth(): number {
    if (this.isMinWidthSm) {
      return 10;
    }
    return 3;
  }

  public getDiameter(): number {
    if (this.isMinWidthSm) {
      return 200;
    }
    return 80;
  }

  public ngOnDestroy(): void {
    this._breakpointSubscription.unsubscribe();
  }
}
