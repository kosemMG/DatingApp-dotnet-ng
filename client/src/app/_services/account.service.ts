import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, ReplaySubject } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from '../../environments/environment';

import { User } from '../_models/user';
import { PresenceService } from './presence.service';

type TokenPayload = {
  nameid: number,
  unique_name: string,
  role: string | string[],
  nbf: number,
  exp: number,
  iat: number
};

@Injectable({
  providedIn: 'root'
})
export class AccountService {
  public baseUrl = environment.apiUrl;

  private currentUserSource = new ReplaySubject<User>(1);
  public currentUser$ = this.currentUserSource.asObservable();

  constructor(private http: HttpClient, private presence: PresenceService) {
  }

  private static getDecodedToken(token: string): TokenPayload {
    const payload = token.split('.')[1];
    return JSON.parse(atob(payload));
  }

  public login(model: any): Observable<void> {
    return this.http.post<User>(this.baseUrl + 'account/login', model).pipe(
      map((user: User) => {
        console.log(user);
        if (user) {
          this.setCurrentUser(user);
          this.presence.createHubConnection(user);
        }
      })
    );
  }

  public logout(): void {
    localStorage.removeItem('user');
    this.currentUserSource.next(null);
    this.presence.stopHubConnection();
  }

  public register(model): Observable<void> {
    return this.http.post<User>(this.baseUrl + 'account/register', model).pipe(
      map((user: User) => {
        if (user) {
          this.setCurrentUser(user);
          this.presence.createHubConnection(user);
        }
      })
    );
  }

  public setCurrentUser(user: User): void {
    user.roles = [];
    const roles = AccountService.getDecodedToken(user.token).role;
    Array.isArray(roles) ? user.roles = roles : user.roles.push(roles);
    localStorage.setItem('user', JSON.stringify(user));
    this.currentUserSource.next(user);
  }
}
