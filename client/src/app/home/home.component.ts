import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  public registerMode = false;

  constructor() {
  }

  public ngOnInit(): void {
  }

  public cancelRegisterMode(event: boolean): void {
    this.registerMode = event;
  }
}
