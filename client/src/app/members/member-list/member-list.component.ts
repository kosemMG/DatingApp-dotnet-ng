import { Component, OnInit } from '@angular/core';
import { Members } from '../../_models/member';
import { MembersService } from '../../_services/members.service';

@Component({
  selector: 'app-member-list',
  templateUrl: './member-list.component.html',
  styleUrls: ['./member-list.component.css']
})
export class MemberListComponent implements OnInit {
  public members: Members;

  constructor(private memberService: MembersService) { }

  ngOnInit(): void {
    this.loadMembers();
  }

  private loadMembers(): void {
    this.memberService.getMembers()
      .subscribe(members => this.members = members);
  }
}
