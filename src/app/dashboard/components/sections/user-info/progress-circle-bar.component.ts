import {
  Component,
  inject,
  Input,
  OnChanges,
  OnDestroy,
  OnInit,
} from '@angular/core';
import { AdministrationEndpointsService } from '@endpoints/administration-endpoints.service';
import { TRole } from 'app/shared/models/role.enum';
import { ILimitsResponse } from 'app/shared/models/user.models';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-progress-circle-bar',
  standalone: true,
  imports: [],
  template: `
    <div class="relative size-48 sm:size-64 flex items-center justify-center">
      <svg class="w-full h-full" viewBox="0 0 64 64">
        <path
          class="text-lightGray"
          stroke-width="4"
          stroke="currentColor"
          fill="none"
          d="M32 4
         a 28 28 0 1 0 0 56
         a 28 28 0 1 0 0 -56" />
        <path
          stroke-width="4"
          [attr.stroke]="getStrokeColor()"
          [attr.stroke-dasharray]="fillAmount + ', ' + circumference"
          stroke-linecap="round"
          fill="none"
          transform="rotate(0 32 32)"
          d="M32 4
         a 28 28 0 1 0 0 56
         a 28 28 0 1 0 0 -56" />
      </svg>
      <div
        class="flex flex-col items-center justify-center absolute text-lg sm:text-2xl lg:text-xl xl:text-2xl font-bold text-mainCreme">
        <span
          >{{ usedSpace?.toPrecision(2) }}/{{
            totalSpace.toPrecision(3)
          }}
          MB</span
        >
        <span class="text-center text-wrap">used of your</span>
        <span class="text-center text-wrap">disk space</span>
      </div>
    </div>
  `,
})
export class ProgressCircleBarComponent
  implements OnChanges, OnInit, OnDestroy
{
  @Input({ required: true }) public usedSpace!: number | undefined;
  @Input({ required: true }) public currentUserRole!: TRole | undefined;

  private _adminEndpointsService = inject(AdministrationEndpointsService);

  private _storageLimitSubscription = new Subscription();

  public storageLimits: ILimitsResponse | null = null;
  public totalSpace = 10.0;

  public radius = 28;
  public circumference = 2 * Math.PI * this.radius;
  public fillAmount = 0;

  public ngOnInit(): void {
    this._storageLimitSubscription = this._adminEndpointsService
      .getStorageLimits()
      .subscribe({
        next: (response: ILimitsResponse) => {
          this.storageLimits = response;
        },
        error: () => {
          this.storageLimits = null;
        },
      });
  }

  public ngOnChanges(): void {
    if (this.storageLimits) {
      switch (this.currentUserRole) {
        case TRole.Admin:
          this.totalSpace = this.storageLimits.adminLimitMb;
          break;
        case TRole.Teacher:
          this.totalSpace = this.storageLimits.teacherLimitMb;
          break;
        case TRole.Student:
          this.totalSpace = this.storageLimits.studentLimitMb;
          break;
        default:
          this.totalSpace = 10.0;
      }

      if (this.usedSpace) {
        this.usedSpace = Math.min(this.usedSpace, this.totalSpace);
        this.fillAmount =
          (this.circumference * this.usedSpace) / this.totalSpace;
      }
    }
  }

  public getStrokeColor(): string {
    if (this.usedSpace) {
      const percentage = this.usedSpace / this.totalSpace;

      const r = Math.round(255 * percentage);
      const g = Math.round(255 * (1 - percentage));
      const b = 0;

      return `rgb(${r}, ${g}, ${b})`;
    }
    return `rgb(0, 255, 0)`;
  }

  public ngOnDestroy(): void {
    this._storageLimitSubscription.unsubscribe();
  }
}
