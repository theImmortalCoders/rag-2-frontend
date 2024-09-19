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
      //mozna dorobic powiadomienie ze wiekszosc opcji jest dostepna dla zalogowanych
      //mozliwe ze w authentication serwisie bede musial dorobic jeszcze observable zeby patrzyl czy sie zmienia stan zalogowania
      //+ pasuje przerobic promise na observable
      //trzeba bedzie zrobic ngrx-em pewnie zeby przechowywac stan zalogowania w subjectcie
      this._vc.clear();
    }
  }
}
