import {
  Directive,
  Input,
  OnDestroy,
  OnInit,
  TemplateRef,
  ViewContainerRef,
} from '@angular/core';
import { AuthenticationService } from '../../app/shared/services/authentication.service';
import { Subscription } from 'rxjs';

@Directive({
  selector: '[appAuthRequired]',
  standalone: true,
})
export class AuthRequiredDirective implements OnInit, OnDestroy {
  private _authSubscription: Subscription | null = null;

  public constructor(
    private _templateRef: TemplateRef<unknown>,
    private _vc: ViewContainerRef,
    private _authService: AuthenticationService
  ) {}

  public ngOnInit(): void {
    this._authSubscription = this._authService.authStatus$.subscribe(
      isAuthenticated => {
        if (isAuthenticated) {
          this._vc.createEmbeddedView(this._templateRef);
        } else {
          this._vc.clear();
          console.log('nie mozna');
          //ew powiadomienie ze wiekszosc opcji jest dostepna po zalogowaniu
        }
      }
    );
  }

  public ngOnDestroy(): void {
    if (this._authSubscription) {
      this._authSubscription.unsubscribe();
    }
  }
}
