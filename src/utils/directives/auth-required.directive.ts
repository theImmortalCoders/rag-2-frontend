import {
  Directive,
  inject,
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

  private _authSubscription = new Subscription();

  public constructor(
    private _templateRef: TemplateRef<unknown>,
    private _vc: ViewContainerRef
  ) {}

  private _errorCounter!: number;

  public ngOnInit(): void {
    setTimeout(() => {
      const errorCounter = localStorage.getItem('errorCounter');
      this._errorCounter = errorCounter ? parseInt(errorCounter) : 0;

      this._authSubscription = this._authService.authStatus$.subscribe(
        isAuthenticated => {
          if (isAuthenticated) {
            this._vc.createEmbeddedView(this._templateRef);
          } else {
            this._vc.clear();
            if (this._errorCounter === 0 && !localStorage.getItem('jwtToken')) {
              console.log(this._errorCounter);
              this._notificationService.addNotification(
                'Some functionalities are available only for logged in users'
              );
              this._errorCounter++;
            }
          }
        }
      );

      localStorage.setItem('errorCounter', this._errorCounter.toString());
    });
  }

  public ngOnDestroy(): void {
    this._authSubscription.unsubscribe();
  }
}
