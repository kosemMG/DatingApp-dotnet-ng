import { Component, OnInit } from '@angular/core';
import { Members } from '../_models/member';
import { PaginatedResult, Pagination } from '../_models/pagination';
import { MembersService } from '../_services/members.service';

@Component({
  selector: 'app-lists',
  templateUrl: './lists.component.html',
  styleUrls: ['./lists.component.css']
})
export class ListsComponent implements OnInit {
  public members: Partial<Members>;
  public predicate = 'liked';
  public pagination: Pagination;

  private pageNumber = 1;
  private pageSize = 5;

  constructor(private memberService: MembersService) { }

  ngOnInit(): void {
    this.loadLikes();
  }

  public loadLikes(): void {
    this.memberService.getLikes(this.predicate, this.pageNumber, this.pageSize)
      .subscribe((response: PaginatedResult<Partial<Members>>) => {
        this.members = response.result;
        this.pagination = response.pagination;
      });
  }

  public onPageChanged(event: number): void {
    this.pageNumber = event;
    this.loadLikes();
  }
}
