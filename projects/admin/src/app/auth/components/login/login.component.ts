import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { LoginService } from './../../services/login.service';
import { NgxSpinnerService } from "ngx-spinner";

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit {
  constructor(
    private fb: FormBuilder,
    private service: LoginService,
    private router:Router,
    private spinner: NgxSpinnerService
  ) {}

  loginForm!: FormGroup;
  isLoading: boolean = false;

  ngOnInit(): void {
    this.createForm();
  }

  createForm() {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [ Validators.required, Validators.minLength(3), Validators.maxLength(20)]],
      role: ['admin'],
    });
  }

  login() {
    this.spinner.show();
    this.service.login(this.loginForm.value).subscribe(
      (res: any) => {
        localStorage.setItem('token', res.token)
        this.router.navigate(['/tasks']);
        this.spinner.hide();
        console.log(res);
      },
      (error) => {
        this.spinner.hide();
        console.log(error);
      }
    );
  }
}
