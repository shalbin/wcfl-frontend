import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { throwError } from 'rxjs';
import { retry, catchError, map } from 'rxjs/operators';

const API_ROOT = '//wcfl.excelmec.org/v3/api/';

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  constructor(private http: HttpClient) { }

  getPlayers() {
    return this.http.get(API_ROOT + 'players')
      .pipe(map(res => res['data']),
        retry(2),
        catchError(this.handleError)
      );
  }

  submitSquad(payload) {
    return this.http.post(API_ROOT + 'submitSquad',
                   JSON.stringify(payload), {withCredentials: true})
                   .pipe(catchError(this.handleError));
  }

  getLineup() {
    return this.http.get(API_ROOT + 'lineup', {withCredentials: true})
      .pipe(map(res => res['data']),
        retry(2),
        catchError(this.handleError)
    );
  }

  getOppLineup(payload) {
  return this.http.post(API_ROOT + 'oppLineup',
                 JSON.stringify(payload), {withCredentials: true})
                 .pipe(map(res => res['data']),
                 catchError(this.handleError));
  }

  private handleError(error: HttpErrorResponse) {
    if (error.error instanceof ErrorEvent) {
      // A client-side or network error occurred. Handle it accordingly.
      console.error('An error occurred:', error.error.message);
    } else {
      // The backend returned an unsuccessful response code.
      // The response body may contain clues as to what went wrong,
      console.error(
        `Backend returned code ${error.status}, ` +
        `body was: ${error.error}`);
    }
    // return an observable with a user-facing error message
    return throwError(
      'Something bad happened; please try again later.');
  }
}
