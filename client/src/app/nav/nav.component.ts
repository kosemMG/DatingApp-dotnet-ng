import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { User } from '../_models/user';
import { AccountService } from '../_services/account.service';

@Component({
  selector: 'app-nav',
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.css']
})
export class NavComponent implements OnInit {
  public model: any = {};
  public currentUser$: Observable<User>;

  constructor(private account: AccountService) {
  }

  ngOnInit(): void {
    this.currentUser$ = this.account.currentUser$;
  }

  public login(): void {
    this.account.login(this.model).subscribe({
      error: error => console.log(error)
    });
  }

  public logout(): void {
    this.account.logout();
  }
}
