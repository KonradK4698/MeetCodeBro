import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, retry, tap, map} from 'rxjs/operators';
import { Invite } from './invitations';

@Injectable({
  providedIn: 'root'
})
export class FriendsService {

  private friendsUrl = '/api/friends';

  httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' })
  };

  constructor(private http: HttpClient) { }

  getFriendInvitation(userID: number): Observable<Invite[]>{
    return this.http.get<Invite[]>(`${this.friendsUrl}/getInvitation/${userID}`, this.httpOptions )
  }

  sendInvitation(senderID: number, recipentID: number ): Observable<string>{
    return this.http.post<string>(`${this.friendsUrl}/sendInvitation/${senderID}/${recipentID}`, this.httpOptions )
  }

}
