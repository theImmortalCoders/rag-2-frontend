import { HttpErrorResponse } from '@angular/common/http';

export function errorHandler(error: HttpErrorResponse): string {
  if (error.status === 401) {
    return 'Unauthorized, you have to be logged in';
  } else if (error.status === 403) {
    return 'Forbidden, you have no permission to do this operation';
  }
  return JSON.parse(error.error)['description'];
}
