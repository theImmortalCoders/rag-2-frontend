import { HttpErrorResponse } from '@angular/common/http';

export function errorHandler(error: HttpErrorResponse): string {
  let errorMessage = 'An error has occured';
  if (error.status === 401) {
    errorMessage = 'Unauthorized, you have to be logged in';
  } else if (error.status === 403) {
    errorMessage = 'Forbidden, you have no permission to do this operation';
  } else {
    errorMessage = JSON.parse(error.error)['description'];
  }
  console.error(errorMessage);
  return errorMessage;
}
