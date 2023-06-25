import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { LoginService } from '../../services/login.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit {
  loginForm!: FormGroup;

  constructor(private fb: FormBuilder, private service: LoginService, private router:Router) {}

  ngOnInit(): void {
    this.createForm();
  }

  // Create Login From
  createForm() {
    this.loginForm = this.fb.group({
        email: ['', [Validators.required, Validators.email]],
        password: ['', Validators.required],
        role: ['user']
      }
    );
  }

  login() {
    this.service.login(this.loginForm.value).subscribe((res: any) => {
      this.router.navigate(['/tasks']);
      localStorage.setItem('token', res.token)
    })
  }
}
