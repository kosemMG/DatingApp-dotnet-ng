import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from '../../environments/environment';
import { Member, Members } from '../_models/member';

@Injectable({
  providedIn: 'root'
})
export class MembersService {
  private baseUrl = environment.apiUrl;
  private members: Members = [];

  constructor(private http: HttpClient) {
  }

  public getMembers(): Observable<Members> {
    if (this.members.length > 0) {
      return of(this.members);
    }
    return this.http.get<Members>(`${this.baseUrl}users`).pipe(
      map(members => {
        this.members = members;
        return members;
      })
    );
  }

  public getMember(username: string): Observable<Member> {
    const currentMember = this.members.find(member => member.username === username);
    if (currentMember !== undefined) {
      return of(currentMember);
    }
    return this.http.get<Member>(`${this.baseUrl}users/${username}`);
  }

  public updateMember(member: Member): Observable<void> {
    return this.http.put<void>(`${this.baseUrl}users`, member).pipe(
      map(() => {
        const index = this.members.indexOf(member);
        this.members[index] = member;
      })
    );
  }

  public setMainPhoto(photoId: number): Observable<void> {
    return this.http.put<void>(`${this.baseUrl}users/set-main-photo/${photoId}`, {});
  }

  public deletePhoto(photoId: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}users/delete-photo/${photoId}`);
  }
}
