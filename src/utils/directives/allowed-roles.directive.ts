import {
  Directive,
  Input,
  OnInit,
  TemplateRef,
  ViewContainerRef,
} from '@angular/core';
import { TRole } from '../../app/shared/models/role.enum';
import { AuthenticationService } from '../../app/shared/services/authentication.service';
@Directive({
  selector: '[appAllowedRoles]',
  standalone: true,
})
export class AllowedRolesDirective implements OnInit {
  @Input({ required: true }) public appAllowedRoles: TRole[] = [];

  public constructor(
    private _templateRef: TemplateRef<unknown>,
    private _vc: ViewContainerRef,
    private _permissionService: AuthenticationService
  ) {}

  public async ngOnInit(): Promise<void> {
    if (
      this.appAllowedRoles.includes(
        await this._permissionService.getCurrentRole()
      )
    ) {
      this._vc.createEmbeddedView(this._templateRef);
    } else {
      this._vc.clear();
    }
  }
}
