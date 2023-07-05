import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { UsersService, changeStatus } from '../../services/users.service';

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.scss'],
})

export class UsersComponent implements OnInit {
  displayedColumns: string[] = [ 'position', 'name', 'email', 'tasksAssigned', 'actions',];

  dataSource: any = [];

  page = 1;

  totalItems: any;

  filteration: any = {
    page : this.page,
    limit : 10,
  };

  timeOutId: any;

  constructor(private service: UsersService) {
    this.getDataFromSubject();
  }

  ngOnInit(): void {
    this.getUsers();
  }

  getUsers() {
    const model = {
      page: this.page,
      limit: 10,
      name: '',
    };

    this.service.getUsersData(model);
  }

  getDataFromSubject() {
    this.service.userData.subscribe((res: any) => {
      console.log('fire');

      this.dataSource = res.data;
      this.totalItems = res.total;
    })
  }

  // pagination
  changePage(event: any) {
    this.page = event;
    this.getUsers();
  }

  deleteUser(id: string, index: number) {
    if( this.dataSource[index].assignedTasks > 0 ) {
      alert('you cant delete this user until finish his tasks');
    } else {
      this.service.deleteUser(id).subscribe(res => {
        this.page = 1;
        this.getUsers();
      })
    }
  }

  changeUserStatus(status: string, id: string, index: number) {
    const model:changeStatus = {
      id,
      status,
    }

    if( this.dataSource[index].assignedTasks > 0 ) {
      alert('you cant update this user until finish his tasks');
    } else {
      this.service.changeStatus(model).subscribe(res => {
        this.page = 1;
        this.getUsers();
      })
    }
  }

  // filter search for task name
  search(event:any) {
    this.filteration['keyword'] = event.value;

    this.page = 1;
    this.filteration['page'] = 1;

    // to prevent sent more requests
    clearTimeout(this.timeOutId);

    this.timeOutId = setTimeout(() => {
      this.getUsers();
    }, 1000);
  }
}
