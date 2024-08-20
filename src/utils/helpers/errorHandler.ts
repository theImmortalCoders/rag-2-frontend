import { HttpErrorResponse } from '@angular/common/http';

export function errorHandler(error: HttpErrorResponse): void {
  if (error.status === 401) {
    console.error('Unauthorized, you have to be logged in');
  } else if (error.status === 403) {
    console.error('Forbidden, you have no permission to do this operation');
  } else {
    console.error(JSON.parse(error.error)['description']);
  }
}
