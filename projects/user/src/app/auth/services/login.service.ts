import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { createAccount } from '../constant/DTO';

@Injectable({
  providedIn: 'root'
})
export class LoginService {

  constructor(private http:HttpClient) { }

  createUser(model: createAccount) {
    return this.http.post(environment.baseApi.replace('tasks', 'auth') + '/createAccount', model);
  }
}
