import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { User } from '../_models/user';

@Injectable({
  providedIn: 'root'
})
export class AdminService {
  private baseUrl = environment.apiUrl;

  constructor(private http: HttpClient) { }

  public getUsersWithRoles(): Observable<Partial<User[]>> {
    return this.http.get<Partial<User[]>>(this.baseUrl + 'admin/users-with-roles');
  }

  public updateRoles(username: string, roles: string[]): Observable<void> {
    return this.http.post<void>(this.baseUrl + 'admin/edit-roles/' + username + '?roles=' + roles, {});
  }
}
