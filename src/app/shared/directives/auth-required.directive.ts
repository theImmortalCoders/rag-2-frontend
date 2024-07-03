import {
  Directive,
  Input,
  OnInit,
  TemplateRef,
  ViewContainerRef,
} from '@angular/core';
import { RoleService } from '../services/permission.service';

@Directive({
  selector: '[appAuthRequired]',
  standalone: true,
})
export class AuthRequiredDirective implements OnInit {
  public constructor(
    private _templateRef: TemplateRef<unknown>,
    private _vc: ViewContainerRef,
    private _permissionService: RoleService
  ) {}

  public ngOnInit(): void {
    if (this._permissionService.isAuthenticated()) {
      this._vc.createEmbeddedView(this._templateRef);
    } else {
      this._vc.clear();
    }
  }
}
