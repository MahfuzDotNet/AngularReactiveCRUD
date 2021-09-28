import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

import { EMPTY, Observable, of, throwError } from 'rxjs';
import { catchError, tap, map } from 'rxjs/operators';

import { User } from './user';

@Injectable({
  providedIn: 'root'
})

export class RegisterService {
  private userApiUrl = 'http://localhost:37429/users';

  constructor(private http: HttpClient) { }
 
  
  getUsers(): Observable<User[]> {   
    return this.http.get<User[]>(this.userApiUrl)
      .pipe(
        tap(data => console.log(JSON.stringify(data))),
        catchError(this.handleError)
      );
  }

  getUser(id: number): Observable<User> {
    if (id === 0) {
      return of(this.initializeUser());
    }
    const url = `${this.userApiUrl}/${id}`;
    return this.http.get<User>(url)
      .pipe(
        tap(data => console.log('getUser: ' + JSON.stringify(data))),
        catchError(this.handleError)
      );
  }

  createUser(user: User): Observable<User> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    user.id = undefined ;
    return this.http.post<User>(this.userApiUrl, user, { headers })
      .pipe(
        tap(data => console.log('createUser: ' + JSON.stringify(data))),
        catchError(this.handleError)
      );
  }

  deleteUser(id: number): Observable<{}> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    const url = `${this.userApiUrl}/${id}`;
    return this.http.delete<User>(url, { headers })
      .pipe(
        tap(data => console.log('deleteUser: ' + id)),
        catchError(this.handleError)
      );
  }

  updateUser(user: User): Observable<User> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    const url = `${this.userApiUrl}/${user.id}`;
    return this.http.put<User>(url, user, { headers })
      .pipe(
        tap(() => console.log('updateUser: ' + user.id)),
        // Return the user on an update
        map(() => user),
        catchError(this.handleError)
      );
  }

  private handleError(err : any) {
    // in a real world app, we may send the server to some remote logging infrastructure
    // instead of just logging it to the console
    let errorMessage: string;
    if (err.error instanceof ErrorEvent) {
      // A client-side or network error occurred. Handle it accordingly.
      errorMessage = `An error occurred: ${err.error.message}`;
    } else {
      // The backend returned an unsuccessful response code.
      // The response body may contain clues as to what went wrong,
      errorMessage = `Backend returned code ${err.status}: ${err.body.error}`;
    }
    console.error(err);
    return throwError(errorMessage);
  }

  private initializeUser(): User {
    // Return an initialized object
    return {
      id: 0,
      name: "",
      description:'' ,
      email: '',
      address: '',
      mobile: '',
      postCode: '',
      imageUrl: '',
    };
  }
}
