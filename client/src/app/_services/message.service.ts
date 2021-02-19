import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { getPaginatedResult, getPaginationHeaders } from '../_helpers/pagination.helper';
import { Message, Messages } from '../_models/message';
import { PaginatedResult } from '../_models/pagination';

@Injectable({
  providedIn: 'root'
})
export class MessageService {
  private baseUrl = environment.apiUrl;

  constructor(private http: HttpClient) {
  }

  public getMessages(pageNumber: number, pageSize: number, container: string): Observable<PaginatedResult<Messages>> {
    let params = getPaginationHeaders(pageNumber, pageSize);
    params = params.append('Container', container);
    return getPaginatedResult<Messages>(this.http, this.baseUrl + 'messages', params);
  }

  public getMessageThread(username: string): Observable<Messages> {
    return this.http.get<Messages>(this.baseUrl + 'messages/thread/' + username);
  }

  public sendMessage(username: string, content: string): Observable<Message> {
    return this.http.post<Message>(this.baseUrl + 'messages', {
      recipientUsername: username,
      content
    });
  }

  public deleteMessage(id: number): Observable<void> {
    return this.http.delete<void>(this.baseUrl + 'messages/' + id);
  }
}
