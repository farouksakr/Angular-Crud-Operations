import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { environment } from '../../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class TasksService {
  constructor(private http: HttpClient) {}

  getUserTasks(userId: string, tasksParams: any) {
    let params = new HttpParams();
    Object.entries(tasksParams).forEach(([key, value]: any) => {
      params = params.append(key, value);
    });

    return this.http.get(environment.baseApi + '/user-tasks/' + userId, { params });
  }
}
