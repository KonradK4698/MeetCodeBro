import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, retry, tap, map} from 'rxjs/operators';
import { User } from './user';
import { limitSkip, SearchData, CatalogData } from './catalog';

@Injectable({
  providedIn: 'root'
})
export class CatalogService {

  private userCatalogPath = '/api/catalog';

  httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' })
  };

  constructor(private http: HttpClient) { }

  getUsersCount(): Observable<number>{
    return this.http.get<number>(`${this.userCatalogPath}/userCount`, this.httpOptions);
  }

  getUserPerPage(data: limitSkip): Observable<User[]>{
    return this.http.post<User[]>(`${this.userCatalogPath}/getUsers`, data, this.httpOptions)
  }

  getUsers(page: number, limit: number, searchData: SearchData): Observable<CatalogData>{
    return this.http.post<CatalogData>(`${this.userCatalogPath}/getUsers/${page}/${limit}`, searchData, this.httpOptions);
  }
}
