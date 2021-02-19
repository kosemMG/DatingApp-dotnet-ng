import { Component, OnInit } from '@angular/core';
import { Messages } from '../_models/message';
import { PaginatedResult, Pagination } from '../_models/pagination';
import { MessageService } from '../_services/message.service';

@Component({
  selector: 'app-messages',
  templateUrl: './messages.component.html',
  styleUrls: ['./messages.component.css']
})
export class MessagesComponent implements OnInit {
  public messages: Messages = [];
  public pagination: Pagination;
  public container = 'Unread';
  public loading: boolean;

  private pageNumber = 1;
  private pageSize = 5;

  constructor(private messageService: MessageService) {
  }

  ngOnInit(): void {
    this.loadMessages();
  }

  public loadMessages(): void {
    this.loading = true;
    this.messageService.getMessages(this.pageNumber, this.pageSize, this.container)
      .subscribe((response: PaginatedResult<Messages>) => {
        this.messages = response.result;
        this.pagination = response.pagination;
        this.loading = false;
      });
  }

  public deleteMessage(event: MouseEvent, id: number): void {
    event.stopPropagation();
    this.messageService.deleteMessage(id)
      .subscribe(() => this.messages = this.messages.filter(message => message.id !== id));
  }

  public onPageChanged(event: number): void {
    this.pageNumber = event;
    this.loadMessages();
  }
}
