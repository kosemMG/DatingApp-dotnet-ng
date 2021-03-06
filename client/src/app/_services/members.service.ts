import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { map, take, tap } from 'rxjs/operators';
import { environment } from '../../environments/environment';

import { getPaginatedResult, getPaginationHeaders } from '../_helpers/pagination.helper';
import { Member, Members } from '../_models/member';
import { PaginatedResult } from '../_models/pagination';
import { User } from '../_models/user';
import { UserParams } from '../_models/user-params';
import { AccountService } from './account.service';

@Injectable({
  providedIn: 'root'
})
export class MembersService {
  private baseUrl = environment.apiUrl;
  private members: Members = [];
  private user: User;
  private _userParams: UserParams;
  private memberCache = new Map<string, PaginatedResult<Members>>();

  constructor(private http: HttpClient, private accountService: AccountService) {
    accountService.currentUser$.pipe(take(1)).subscribe(user => {
      this.user = user;
      this.userParams = new UserParams(user);
    });
  }

  public set userParams(value: UserParams) {
    this._userParams = value;
  }

  public get userParams(): UserParams {
    return this._userParams;
  }

  public resetUserParams(): UserParams {
    this._userParams = new UserParams(this.user);
    return this._userParams;
  }

  public getMembers(userParams: UserParams): Observable<PaginatedResult<Members>> {
    const requestKey = Object.values(userParams).join('-');
    const response = this.memberCache.get(requestKey);
    if (response) {
      return of(response);
    }

    const { pageNumber, pageSize, gender, minAge, maxAge, orderBy } = userParams;
    let params = getPaginationHeaders(pageNumber, pageSize);
    params = params.append('gender', gender);
    params = params.append('minAge', minAge.toString());
    params = params.append('maxAge', maxAge.toString());
    params = params.append('orderBy', orderBy);

    return getPaginatedResult<Members>(this.http, this.baseUrl + 'users', params)
      .pipe(tap((res: PaginatedResult<Members>) => {
        this.memberCache.set(requestKey, res);
        // return response;
      }));
  }

  public getMember(username: string): Observable<Member> {
    const currentMember = [...this.memberCache.values()]
      .reduce((arr: Members, elem: PaginatedResult<Members>) => arr.concat(elem.result), [])
      .find((member: Member) => member.username === username);

    if (currentMember) {
      return of(currentMember);
    }
    return this.http.get<Member>(`${ this.baseUrl }users/${ username }`);
  }

  public updateMember(member: Member): Observable<void> {
    return this.http.put<void>(`${ this.baseUrl }users`, member).pipe(
      map(() => {
        const index = this.members.indexOf(member);
        this.members[index] = member;
      })
    );
  }

  public setMainPhoto(photoId: number): Observable<void> {
    return this.http.put<void>(`${ this.baseUrl }users/set-main-photo/${ photoId }`, {});
  }

  public deletePhoto(photoId: number): Observable<void> {
    return this.http.delete<void>(`${ this.baseUrl }users/delete-photo/${ photoId }`);
  }

  public addLike(username: string): Observable<void> {
    return this.http.post<void>(`${ this.baseUrl }likes/${ username }`, {});
  }

  public getLikes(predicate: string, pageNumber: number, pageSize: number): Observable<PaginatedResult<Partial<Members>>> {
    let params = getPaginationHeaders(pageNumber, pageSize);
    params = params.append('predicate', predicate);
    return getPaginatedResult<Partial<Members>>(this.http, this.baseUrl + 'likes', params);
  }
}
