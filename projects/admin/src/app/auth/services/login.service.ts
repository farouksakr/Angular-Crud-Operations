import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
// import { environment } from 'projects/admin/src/environments/environment';
import { environment } from '../../../environments/environment';
import { login } from '../context/DTOs';

@Injectable({
  providedIn: 'root',
})
export class LoginService {
  constructor(private http: HttpClient) {}

  login(model: login) {
    return this.http.post(environment.baseApi.replace('tasks', 'auth') + '/login', model);
  }
}
