import {
  Directive,
  Input,
  OnInit,
  TemplateRef,
  ViewContainerRef,
} from '@angular/core';
import { RoleService } from '../services/permission.service';
import { TRole } from '../models/role.enum';

@Directive({
  selector: '[appAllowedRoles]',
  standalone: true,
})
export class AllowedRolesDirective implements OnInit {
  @Input({ required: true }) public appAllowedRoles: TRole[] = [];

  public constructor(
    private _templateRef: TemplateRef<unknown>,
    private _vc: ViewContainerRef,
    private _permissionService: RoleService
  ) {}

  public ngOnInit(): void {
    if (
      this.appAllowedRoles.includes(this._permissionService.getCurrentRole())
    ) {
      this._vc.createEmbeddedView(this._templateRef);
    } else {
      this._vc.clear();
    }
  }
}
