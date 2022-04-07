import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { User } from './user';

@Injectable({
  providedIn: 'root'
})
export class LoginService {

  private loginUserUrl = '/api/login';

  private handleError(error: HttpErrorResponse){

    return throwError( () => new Error("Wystąpił błąd. Spróbuj później."))
  }

  httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' })
  };

  constructor(private http: HttpClient) { }

  loginUser(user: User): Observable<User>{
    return this.http.post<User>(this.loginUserUrl, user, this.httpOptions).pipe(
      catchError(this.handleError)
    )
  }

}
