import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, retry, tap, map} from 'rxjs/operators';
import { User } from './user';
import { Technology } from 'src/app/technology';

@Injectable({
  providedIn: 'root'
})
export class UserProfileService {

  private userApiUrl = "/api/user";
  private technologyApi = "/api/technologies"

  httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' })
  };

  private handleError(error: HttpErrorResponse){
    if(error.status === 401){
      return throwError( () => new Error("brak dostępu"))
    }
    return throwError( () => new Error("Wystąpił błąd. Spróbuj później."))
  }

  constructor(private http: HttpClient) { }

  getUserData(userID: number): Observable<User>{
    return this.http.get<User>(`${this.userApiUrl}/${userID}`, this.httpOptions ).pipe(
      catchError(this.handleError)
    );
  }

  sendUserData(userID: number, data: User): Observable<User>{
    return this.http.post<User>(`${this.userApiUrl}/${userID}`, data, this.httpOptions).pipe(
      catchError(this.handleError)
    )
  }

  getTechnologies(): Observable<Technology[]>{
    return this.http.get<Technology[]>(this.technologyApi, this.httpOptions).pipe(
      catchError(this.handleError)
    )
  }

  addUserTechnology(userID: number, choosenTechnologies: Technology[]): Observable<Technology[]>{
    return this.http.post<Technology[]>(`${this.userApiUrl}/technologies/${userID}`, choosenTechnologies, this.httpOptions).pipe(
      catchError(this.handleError)
    );
  }
}
