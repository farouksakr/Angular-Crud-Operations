import { Component, OnInit } from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  FormGroup,
  ValidationErrors,
  ValidatorFn,
  Validators,
} from '@angular/forms';
import { createAccount } from '../../constant/DTO';
import { LoginService } from '../../services/login.service';
@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss'],
})
export class RegisterComponent implements OnInit {
  registerForm!: FormGroup;

  constructor(private fb: FormBuilder, private service: LoginService) {}

  ngOnInit(): void {
    this.createForm();
  }

  // Create Registe From
  createForm() {
    this.registerForm = this.fb.group(
      {
        username: ['', Validators.required],
        email: ['', [Validators.required, Validators.email]],
        password: ['', Validators.required],
        confirmpassword: ['', Validators.required],
      },
      { validators: this.checkPassword }
    );
  }

  createAccont() {
    const model: createAccount = {
      username: this.registerForm.value['username'],
      email: this.registerForm.value['email'],
      password: this.registerForm.value['password'],
      role: 'user',
    };
    this.service.createUser(model).subscribe(
      (res) => {
        console.log('succes');
      },
      (error) => {
        console.log('error');
      }
    );
  }

  checkPassword: ValidatorFn = (group: AbstractControl): ValidationErrors | null => {
    let password = group.get('password')?.value;
    let confirmpassword = group.get('confirmpassword')?.value;

    return password === confirmpassword ? null : { notSame: true };
  };
}
