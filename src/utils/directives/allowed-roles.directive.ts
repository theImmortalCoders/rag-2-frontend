import {
  Directive,
  inject,
  Input,
  OnDestroy,
  OnInit,
  TemplateRef,
  ViewContainerRef,
} from '@angular/core';
import { TRole } from 'app/shared/models/role.enum';
import { AppStatusService } from 'app/shared/services/app-status.service';
import { Subscription } from 'rxjs';
@Directive({
  selector: '[appAllowedRoles]',
  standalone: true,
})
export class AllowedRolesDirective implements OnInit, OnDestroy {
  //example how to use:
  //
  //<div *appAllowedRoles="allowedRoles">
  //public allowedRoles: TRole[] = [TRole.Admin];
  @Input({ required: true }) public appAllowedRoles: TRole[] = [];

  private _appStatusService = inject(AppStatusService);

  private _roleSubscription = new Subscription();

  public constructor(
    private _templateRef: TemplateRef<unknown>,
    private _vc: ViewContainerRef
  ) {}

  public ngOnInit(): void {
    this._roleSubscription = this._appStatusService.currentRole$.subscribe(
      role => {
        if (role && this.appAllowedRoles.includes(role)) {
          this._vc.createEmbeddedView(this._templateRef);
        } else {
          this._vc.clear();
        }
      }
    );
  }

  public ngOnDestroy(): void {
    this._roleSubscription.unsubscribe();
  }
}
