import {
  Directive,
  Input,
  OnInit,
  TemplateRef,
  ViewContainerRef,
} from '@angular/core';
import { AuthenticationService } from '../../app/shared/services/authentication.service';

@Directive({
  selector: '[appAuthRequired]',
  standalone: true,
})
export class AuthRequiredDirective implements OnInit {
  public constructor(
    private _templateRef: TemplateRef<unknown>,
    private _vc: ViewContainerRef,
    private _permissionService: AuthenticationService
  ) {}

  public async ngOnInit(): Promise<void> {
    if (await this._permissionService.isAuthenticated()) {
      this._vc.createEmbeddedView(this._templateRef);
    } else {
      this._vc.clear();
    }
  }
}
