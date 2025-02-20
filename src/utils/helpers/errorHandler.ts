import { HttpErrorResponse } from '@angular/common/http';
import { environment } from '@env/environment';

export function errorHandler(error: HttpErrorResponse): string {
  let errorMessage = 'An error has occured';
  if (error.status === 401) {
    errorMessage = 'Unauthorized, you have to be logged in';
  } else if (error.status === 403) {
    errorMessage = 'Forbidden, you have no permission to do this operation';
  } else if(error.status === 500 || error.statusText === "Unknown Error") {
    if (window.location.pathname !== '/error500' && environment.production) {
      window.location.href = '/error500';
    }
    errorMessage = error.message;
  } else {
    errorMessage = JSON.parse(error.error)['description'];
  }
  console.error(errorMessage);
  return errorMessage;
}
