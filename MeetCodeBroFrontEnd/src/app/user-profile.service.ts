import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, retry, tap, map} from 'rxjs/operators';
import { User } from './user';
import { Technology } from 'src/app/technology';
import { Friend } from './friend';

@Injectable({
  providedIn: 'root'
})
export class UserProfileService {

  private userApiUrl = "/api/user";
  private technologyApi = "/api/technologies";
  private friendsApi = "/api/friends";

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

  getUserArray(userIdArr: number[]): Observable<User[]>{
    console.log(encodeURIComponent(JSON.stringify(userIdArr)))
    return this.http.get<User[]>(`${this.userApiUrl}/moreThenOne/id/${encodeURIComponent(JSON.stringify(userIdArr))}`, this.httpOptions).pipe(
      catchError(this.handleError)
    );;
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

  getUserTechnology(userID: number): Observable<Technology[]>{
    return this.http.get<Technology[]>(`${this.technologyApi}/${userID}`, this.httpOptions).pipe(
      catchError(this.handleError)
    )
  }

  addUserTechnology(userID: number, choosenTechnologies: Technology[]): Observable<Technology[]>{
    return this.http.post<Technology[]>(`${this.userApiUrl}/technologies/${userID}`, choosenTechnologies, this.httpOptions).pipe(
      catchError(this.handleError)
    );
  }

  deleteInvitation(userID: number, invitationID: number): Observable<string>{
    return this.http.delete<string>(`${this.friendsApi}/deleteInvitation/${userID}/${invitationID}`, this.httpOptions).pipe(
      catchError(this.handleError)
    )
  }

  getAllFriends(userID: number): Observable<Friend[]>{
    return this.http.get<Friend[]>(`${this.friendsApi}/${userID}`, this.httpOptions).pipe(catchError(this.handleError))
  }

  addFriend(senderID: number, recipentID: number): Observable<String>{
    return this.http.post<String>(`${this.friendsApi}/${senderID}/${recipentID}`, this.httpOptions).pipe(catchError(this.handleError))
  }

  deleteFriend(userID: number, friendID: number): Observable<string>{
    return this.http.delete<string>(`${this.friendsApi}/${userID}/${friendID}`, this.httpOptions).pipe(catchError(this.handleError))
  }
}
