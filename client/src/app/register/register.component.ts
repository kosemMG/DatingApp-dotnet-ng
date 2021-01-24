import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';
import { AccountService } from '../_services/account.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {
  @Output() cancelRegister = new EventEmitter();
  public model: any = {};

  constructor(private account: AccountService) { }

  ngOnInit(): void {
  }

  public register(): void {
    this.account.register(this.model).subscribe(
      () => this.cancel(),
      error => console.log(error)
    );
  }

  public cancel(): void {
    this.cancelRegister.emit(false);
  }
}
