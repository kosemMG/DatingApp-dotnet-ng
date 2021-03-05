import { ChangeDetectionStrategy, Component, Input, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Messages } from '../../_models/message';
import { MessageService } from '../../_services/message.service';

@Component({
  selector: 'app-member-messages',
  templateUrl: './member-messages.component.html',
  styleUrls: ['./member-messages.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class MemberMessagesComponent {
  @ViewChild('messageForm') messageForm: NgForm;
  @Input() messages: Messages;
  @Input() username: string;

  public messageContent: string;

  constructor(public messageService: MessageService) {
  }

  public sendMessage(): void {
    this.messageService.sendMessage(this.username, this.messageContent)
      .then(() => this.messageForm.reset());
  }
}
