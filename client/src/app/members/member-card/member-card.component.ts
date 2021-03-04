import { Component, Input, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';

import { Member } from '../../_models/member';
import { MembersService } from '../../_services/members.service';
import { PresenceService } from '../../_services/presence.service';

@Component({
  selector: 'app-member-card',
  templateUrl: './member-card.component.html',
  styleUrls: ['./member-card.component.css']
})
export class MemberCardComponent implements OnInit {
  @Input() member: Member;

  constructor(
    private memberService: MembersService,
    private toastrService: ToastrService,
    public presence: PresenceService
  ) { }

  ngOnInit(): void {
  }

  public addLike(member: Member): void {
    this.memberService.addLike(member.username)
      .subscribe(() => this.toastrService.success('You have liked ' + member.knownAs));
  }
}
