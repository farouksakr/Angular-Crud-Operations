import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { TasksService } from '../../services/tasks.service';

@Component({
  selector: 'app-list-tasks',
  templateUrl: './list-tasks.component.html',
  styleUrls: ['./list-tasks.component.scss'],
})

export class ListTasksComponent implements OnInit {
  displayedColumns: string[] = ['position','title','user','deadLineDate','status','actions',];

  dataSource: any = [];

  tasksFilter!: FormGroup;

  users: any = [{ name: 'Moahmed', id: 1 },{ name: 'Ali', id: 2 },{ name: 'Ahmed', id: 3 },{ name: 'Zain', id: 4 },];

  status: any = [{ name: 'Complete', id: 1 },{ name: 'In-Prossing', id: 2 },];

  page: any = 1;

  userDate: any;

  selectedStatus: string = 'In-Progress';

  totalItems: any = 0;

  constructor(public dialog: MatDialog, private fb: FormBuilder, private service: TasksService) {}

  ngOnInit(): void {
    this.createform();
    this.getUSerData();
    this.getAllTasks();
  }

  createform() {
    this.tasksFilter = this.fb.group({
      title: [''],
      userId: [''],
      fromDate: [''],
      toDate: [''],
    });
  }

  // Extract The Data From Token
  getUSerData() {
    let token = JSON.stringify(localStorage.getItem('token'));
    this.userDate =  JSON.parse(window.atob(token.split('.')[1]));
    console.log(this.userDate);
  }

  // Get All Tasks
  getAllTasks() {
    let params = {
      page: this.page,
      limit: 10,
      status: this.selectedStatus
    }

    this.service.getUserTasks(this.userDate.userId, params).subscribe((res: any) => {
      this.dataSource = res.tasks;
      this.totalItems = res.totalItems;
    }, (err) => {
      this.dataSource = [];
    })
  }

  // Pagination
  changePage(event: any) {
    this.page = event;
    this.getAllTasks();
  }

  complete(ele: any) {
    const model = {
      id: ele._id
    }
    this.service.completeTAsk(model).subscribe((res) => {
      this.getAllTasks();
    })
  }

}
