import { Component, OnInit } from '@angular/core';
import { User } from './_models/user';
import { AccountService } from './_services/account.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  public title = 'Dating App';

  constructor(private account: AccountService) {
  }

  public ngOnInit(): void {
    this.setCurrentUser();
  }

  private setCurrentUser(): void {
    const user: User = JSON.parse(localStorage.getItem('user'));
    if (user) {
      this.account.setCurrentUser(user);
    }
  }
}
