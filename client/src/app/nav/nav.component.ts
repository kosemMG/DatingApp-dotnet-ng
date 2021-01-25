import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
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

  constructor(
    private account: AccountService,
    private router: Router,
    private toastr: ToastrService
  ) {
  }

  ngOnInit(): void {
    this.currentUser$ = this.account.currentUser$;
  }

  public login(): void {
    this.account.login(this.model).subscribe(
      () => this.router.navigateByUrl('/members'),
      error => {
        console.log(error);
        this.toastr.error(error.error);
      }
    );
  }

  public logout(): void {
    this.account.logout();
    this.router.navigateByUrl('/');
  }
}
