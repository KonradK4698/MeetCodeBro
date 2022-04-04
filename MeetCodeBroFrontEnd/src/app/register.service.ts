 import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, retry, tap} from 'rxjs/operators';
import { User } from './user';

@Injectable({
  providedIn: 'root'
})
export class RegisterService {

  private addUserUrl = '/api/register';
  

  httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' })
  };


  constructor(private http: HttpClient) { }

  addUser(user: User): Observable<User>{
    console.log(this.addUserUrl);
    return this.http.post<User>(this.addUserUrl, user, this.httpOptions).pipe(
      tap(
      {
        next: (data) => console.log("Next" + data),
        error: (error) => console.log(error)
      }
      )
    )
  }
}
