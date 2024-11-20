import {
  ChangeDetectorRef,
  Directive,
  inject,
  OnDestroy,
  OnInit,
  TemplateRef,
  ViewContainerRef,
} from '@angular/core';
import { AppStatusService } from '../../app/shared/services/app-status.service';
import { Subscription } from 'rxjs';
import { NotificationService } from 'app/shared/services/notification.service';

@Directive({
  selector: '[appAuthRequired]',
  standalone: true,
})
export class AuthRequiredDirective implements OnInit, OnDestroy {
  private _appStatusService = inject(AppStatusService);
  private _notificationService = inject(NotificationService);

  private _authSubscription = new Subscription();

  public constructor(
    private _templateRef: TemplateRef<unknown>,
    private _vc: ViewContainerRef,
    private _cdr: ChangeDetectorRef
  ) {}

  private _errorCounter!: number;

  public ngOnInit(): void {
    const errorCounter = localStorage.getItem('errorCounter');
    this._errorCounter = errorCounter ? parseInt(errorCounter) : 0;

    this._authSubscription = this._appStatusService.authStatus$.subscribe(
      isAuthenticated => {
        if (isAuthenticated) {
          this._vc.createEmbeddedView(this._templateRef);
        } else {
          this._vc.clear();
          if (this._errorCounter === 0 && !localStorage.getItem('jwtToken')) {
            this._notificationService.addNotification(
              'Some functionalities are available only for logged in users', 3000
            );
            this._errorCounter++;
            localStorage.setItem('errorCounter', this._errorCounter.toString());
          }
        }
        this._cdr.detectChanges();
      }
    );
  }

  public ngOnDestroy(): void {
    this._authSubscription.unsubscribe();
  }
}
