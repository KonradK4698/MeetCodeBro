 import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, retry, tap, map} from 'rxjs/operators';
import { User } from './user';

@Injectable({
  providedIn: 'root'
})
export class RegisterService {

  private addUserUrl = '/api/register';
  
  private handleError(error: HttpErrorResponse){
    if(error.status === 409){
      return throwError( () => new Error("Użytkownik o podanym adresie e-mail już istnieje."))
    }

    return throwError( () => new Error("Wystąpił błąd. Spróbuj później."))
  }

  httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' })
  };


  constructor(private http: HttpClient) { }

  addUser(user: User): Observable<User>{
    console.log(this.addUserUrl);
    return this.http.post<User>(this.addUserUrl, user, this.httpOptions).pipe(
      catchError(this.handleError)
    )
  }
}
