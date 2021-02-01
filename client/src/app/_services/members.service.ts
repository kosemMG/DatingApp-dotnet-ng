import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { Member, Members } from '../_models/member';

@Injectable({
  providedIn: 'root'
})
export class MembersService {
  private baseUrl = environment.apiUrl;

  constructor(private http: HttpClient) {
  }

  public getMembers(): Observable<Members> {
    return this.http.get<Members>(`${this.baseUrl}users`);
  }

  public getMember(username: string): Observable<Member> {
    return this.http.get<Member>(`${this.baseUrl}users/${username}`);
  }
}
