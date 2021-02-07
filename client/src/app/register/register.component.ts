import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, ValidatorFn, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { NgbDate, NgbDateStruct } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { AccountService } from '../_services/account.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {
  @Output() cancelRegister = new EventEmitter();
  public registerForm: FormGroup;
  public maxDate: NgbDateStruct;
  public minDate: NgbDateStruct;
  public validationErrors: string[] = [];

  constructor(
    private account: AccountService,
    private toastr: ToastrService,
    private formBuilder: FormBuilder,
    private router: Router
  ) {
  }

  ngOnInit(): void {
    this.initialiseForm();
    const date = new Date();
    this.maxDate = new NgbDate(date.getFullYear() - 18, date.getMonth() + 1, date.getDate());
    this.minDate = new NgbDate(date.getFullYear() - 120, date.getMonth() + 1, date.getDate());
  }

  public register(): void {
    const date: NgbDate = this.registerForm.get('dateOfBirth').value;
    this.registerForm.patchValue({
      dateOfBirth: new Date(date.year, date.month, date.day)
    });

    this.account.register(this.registerForm.value).subscribe(
      () => this.router.navigateByUrl('/members'),
      (error: string[]) => this.validationErrors = error
    );
  }

  public cancel(): void {
    this.cancelRegister.emit(false);
  }

  private initialiseForm(): void {
    this.registerForm = this.formBuilder.group({
      gender: ['male'],
      username: ['', Validators.required],
      knownAs: ['', Validators.required],
      dateOfBirth: ['', Validators.required],
      city: ['', Validators.required],
      country: ['', Validators.required],
      password: [
        '', [
          Validators.required,
          Validators.minLength(3),
          Validators.maxLength(8)
        ]
      ],
      confirmPassword: ['', this.matchValues('password')]
    });
    // In case the 'password' field was changed after 'confirm password' this runs the validation once again
    this.registerForm.controls.password.valueChanges
      .subscribe(() => this.registerForm.controls.confirmPassword.updateValueAndValidity());
  }

  private matchValues(matchTo: string): ValidatorFn {
    return (control: AbstractControl) => control?.value === control?.parent?.controls[matchTo].value
                                         ? null
                                         : { isMatching: true };
  }
}
