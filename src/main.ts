import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { AppComponent } from './app/app.component';
import { environment } from '@env/environment';

bootstrapApplication(AppComponent, appConfig).catch(err => console.error(err));

if (environment.production) {
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  window.console.log = (): void => {};
}
