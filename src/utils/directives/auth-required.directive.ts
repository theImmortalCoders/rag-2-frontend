import {
  Directive,
  inject,
  Input,
  OnDestroy,
  OnInit,
  TemplateRef,
  ViewContainerRef,
} from '@angular/core';
import { AuthenticationService } from '../../app/shared/services/authentication.service';
import { Subscription } from 'rxjs';
import { NotificationService } from 'app/shared/services/notification.service';

@Directive({
  selector: '[appAuthRequired]',
  standalone: true,
})
export class AuthRequiredDirective implements OnInit, OnDestroy {
  private _authService = inject(AuthenticationService);
  private _notificationService = inject(NotificationService);

  private _authSubscription: Subscription | null = null;

  public constructor(
    private _templateRef: TemplateRef<unknown>,
    private _vc: ViewContainerRef
  ) {}

  private _errorCounter = 0;

  public ngOnInit(): void {
    this._authSubscription = this._authService.authStatus$.subscribe(
      isAuthenticated => {
        if (isAuthenticated) {
          this._vc.createEmbeddedView(this._templateRef);
          this._errorCounter = 0;
        } else {
          this._vc.clear();
          if (this._errorCounter === 0) {
            this._notificationService.addNotification(
              'Some functionalities are available only for logged in users'
            );
          }
          this._errorCounter++;
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
