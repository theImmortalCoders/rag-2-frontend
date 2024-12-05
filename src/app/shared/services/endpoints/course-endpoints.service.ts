import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '@env/environment';
import { errorHandler } from '@utils/helpers/errorHandler';
import { getAuthHeaders } from '@utils/helpers/jwtTokenAuthHeader';
import {
  ICourseRequest,
  ICourseResponse,
} from 'app/shared/models/endpoints/course.models';
import { catchError, Observable, tap, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class CourseEndpointsService {
  private _httpClient = inject(HttpClient);

  public getCourses(): Observable<ICourseResponse[]> {
    return this._httpClient
      .get<ICourseResponse[]>(environment.backendApiUrl + `/api/Course`, {
        responseType: 'json',
      })
      .pipe(
        tap({
          next: () => {
            console.log('Avalaible courses retrieved successfully');
          },
        }),
        catchError((error: HttpErrorResponse) => {
          return throwError(() => errorHandler(error));
        })
      );
  }

  public addCourse(courseData: ICourseRequest): Observable<void> {
    return this._httpClient
      .post<void>(environment.backendApiUrl + `/api/Course`, courseData, {
        headers: getAuthHeaders(),
        responseType: 'text' as 'json',
      })
      .pipe(
        tap({
          next: () => {
            console.log('Course added successfully');
          },
        }),
        catchError((error: HttpErrorResponse) => {
          return throwError(() => errorHandler(error));
        })
      );
  }

  public updateCourse(
    courseId: number,
    courseData: ICourseRequest
  ): Observable<void> {
    return this._httpClient
      .put<void>(
        environment.backendApiUrl + `/api/Course/${courseId}`,
        courseData,
        {
          headers: getAuthHeaders(),
          responseType: 'text' as 'json',
        }
      )
      .pipe(
        tap({
          next: () => {
            console.log('Course updated successfully');
          },
        }),
        catchError((error: HttpErrorResponse) => {
          return throwError(() => errorHandler(error));
        })
      );
  }

  public deleteCourse(courseId: number): Observable<void> {
    return this._httpClient
      .delete<void>(environment.backendApiUrl + `/api/Course/${courseId}`, {
        headers: getAuthHeaders(),
        responseType: 'text' as 'json',
      })
      .pipe(
        tap({
          next: () => {
            console.log('Course deleted successfully');
          },
        }),
        catchError((error: HttpErrorResponse) => {
          return throwError(() => errorHandler(error));
        })
      );
  }
}
