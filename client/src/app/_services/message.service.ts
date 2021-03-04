import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { HubConnection, HubConnectionBuilder } from '@microsoft/signalr';
import { BehaviorSubject, Observable } from 'rxjs';
import { take } from 'rxjs/operators';
import { environment } from '../../environments/environment';
import { getPaginatedResult, getPaginationHeaders } from '../_helpers/pagination.helper';
import { Group } from '../_models/group';
import { Messages } from '../_models/message';
import { PaginatedResult } from '../_models/pagination';
import { User } from '../_models/user';

@Injectable({
  providedIn: 'root'
})
export class MessageService {
  private baseUrl = environment.apiUrl;
  private hubUrl = environment.hubUrl;
  private hubConnection: HubConnection;
  private messageThreadSource = new BehaviorSubject<Messages>([]);

  public messageThread$ = this.messageThreadSource.asObservable();

  constructor(private http: HttpClient) {
  }

  public createHubConnection(user: User, otherUsername: string): void {
    this.hubConnection = new HubConnectionBuilder()
      .withUrl(this.hubUrl + 'message?user=' + otherUsername, {
        accessTokenFactory: () => user.token
      })
      .withAutomaticReconnect()
      .build();

    this.hubConnection.start().catch(error => console.log(error));

    this.hubConnection.on('ReceiveMessageThread', messages => {
      this.messageThreadSource.next(messages);
    });

    this.hubConnection.on('NewMessage', message => {
      this.messageThread$.pipe(take(1)).subscribe(messages => {
        this.messageThreadSource.next([...messages, message]);
      });
    });

    this.hubConnection.on('UpdateGroup', (group: Group) => {
      if (group.connections.some(connection => connection.username === otherUsername)) {
        this.messageThread$.pipe(take(1)).subscribe(messages => {
          messages.forEach(message => {
            if (!message.dateRead) {
              message.dateRead = new Date(Date.now());
            }
          });
          this.messageThreadSource.next([...messages]);
        });
      }
    });
  }

  public stopHubConnection(): void {
    if (this.hubConnection) {
      this.hubConnection.stop().catch(error => console.log(error));
    }
  }

  public getMessages(pageNumber: number, pageSize: number, container: string): Observable<PaginatedResult<Messages>> {
    let params = getPaginationHeaders(pageNumber, pageSize);
    params = params.append('Container', container);
    return getPaginatedResult<Messages>(this.http, this.baseUrl + 'messages', params);
  }

  public getMessageThread(username: string): Observable<Messages> {
    return this.http.get<Messages>(this.baseUrl + 'messages/thread/' + username);
  }

  public async sendMessage(username: string, content: string): Promise<void> {
    return this.hubConnection.invoke('SendMessage', {
      recipientUsername: username,
      content
    })
      .catch(error => console.log(error));
  }

  public deleteMessage(id: number): Observable<void> {
    return this.http.delete<void>(this.baseUrl + 'messages/' + id);
  }
}
