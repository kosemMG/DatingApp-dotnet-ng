import { Component, OnInit } from '@angular/core';

import { Members } from '../../_models/member';
import { PaginatedResult, Pagination } from '../../_models/pagination';
import { User } from '../../_models/user';
import { UserParams } from '../../_models/user-params';
import { MembersService } from '../../_services/members.service';

@Component({
  selector: 'app-member-list',
  templateUrl: './member-list.component.html',
  styleUrls: ['./member-list.component.css']
})
export class MemberListComponent implements OnInit {
  public members: Members;
  public pagination: Pagination;
  public genderList = [{ value: 'male', display: 'Males' }, { value: 'female', display: 'Females' }];
  public userParams: UserParams;

  private user: User;

  constructor(private memberService: MembersService) {
    this.userParams = memberService.userParams;
  }

  ngOnInit(): void {
    this.loadMembers();
  }

  public loadMembers(): void {
    this.memberService.userParams = this.userParams;
    this.memberService.getMembers(this.userParams)
      .subscribe((response: PaginatedResult<Members>) => {
        this.members = response.result;
        this.pagination = response.pagination;
      });
  }

  public onPageChanged(pageNumber: number): void {
    this.userParams.pageNumber = pageNumber;
    this.memberService.userParams = this.userParams;
    this.loadMembers();
  }

  public resetFilters(): void {
    this.userParams = this.memberService.resetUserParams();
    this.loadMembers();
  }
}
