import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-test-errors',
  templateUrl: './test-errors.component.html',
  styleUrls: ['./test-errors.component.css']
})
export class TestErrorsComponent implements OnInit {
  public validationErrors: string[] = [];

  private baseUrl = 'http://localhost:5000/api/';

  constructor(private http: HttpClient) {
  }

  ngOnInit(): void {
  }

  public get404Error(): void {
    this.http.get(this.baseUrl + 'buggy/not-found').subscribe(
      response => console.log(response),
      error => console.log(error)
    );
  }

  public get400Error(): void {
    this.http.get(this.baseUrl + 'buggy/bad-request').subscribe(
      response => console.log(response),
      error => console.log(error)
    );
  }

  public get401Error(): void {
    this.http.get(this.baseUrl + 'buggy/auth').subscribe(
      response => console.log(response),
      error => console.log(error)
    );
  }

  public get500Error(): void {
    this.http.get(this.baseUrl + 'buggy/server-error').subscribe(
      response => console.log(response),
      error => console.log(error)
    );
  }

  public get400ValidationError(): void {
    this.http.post(this.baseUrl + 'account/register', {}).subscribe(
      response => console.log(response),
      error => {
        console.log(error);
        this.validationErrors = error;
      }
    );
  }
}
