import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { TasksService } from '../../services/tasks.service';
import { AddTaskComponent } from '../add-task/add-task.component';
import { NgxSpinnerService } from 'ngx-spinner';
import * as moment from 'moment';

export interface PeriodicElement {
  title: string;
  user: string;
  deadLineDate: string;
  status: string;
}

@Component({
  selector: 'app-list-tasks',
  templateUrl: './list-tasks.component.html',
  styleUrls: ['./list-tasks.component.scss'],
})
export class ListTasksComponent implements OnInit {
  displayedColumns: string[] = [ 'position', 'title', 'user', 'deadline', 'status', 'actions',];

  users: any = [ { name: 'Mohamed', id: '64099a37a17641587dcce4e8' }, { name: 'Ali', id: '64099684a17641587dcce4df' } ];

  status: any = [ { name: 'Complete' }, { name: 'In-Progress' } ];

  dataSource: any = [];

  tasksFilter!: FormGroup;

  timeOutId: any;

  page: any = 1;

  total: any;

  filteration: any = {
    page : this.page,
    limit : 10,
  };

  constructor(
    private service: TasksService,
    private dialog: MatDialog,
    private spinner: NgxSpinnerService
  ) {}

  ngOnInit(): void {
    this.getAllTasks();
  }

  // ****************************** Filtre Methods *******************************

  // filter search for task name
  search(event:any) {
    this.filteration['keyword'] = event.value;

    this.page = 1;
    this.filteration['page'] = 1;

    // to prevent sent more requests
    clearTimeout(this.timeOutId);

    this.timeOutId = setTimeout(() => {
      this.getAllTasks();
    }, 1000);
  }

  // filter search for user id
  selectionUser(event: any) {
    this.page = 1;
    this.filteration['page'] = 1;

    this.filteration['userId'] = event.value;
    this.getAllTasks();
  }

  // filter search for Status
  selectionStatus(event: any) {
    this.page = 1;
    this.filteration['page'] = 1;

    this.filteration['status'] = event.value;
    console.log(event);
    this.getAllTasks();
  }


  selectData(event: any, type: any){
    this.page = 1;
    this.filteration['page'] = 1;

    this.filteration[type] = moment(event.value).format('DD-MM-YYYY');
    if(type == 'toDate' && this.filteration['toDate'] !== 'Invalid date') {
      this.getAllTasks();
    }
  }
  // *****************************************************************************

  //  Get All Tasks
  getAllTasks() {
    this.service.getAllTasks(this.filteration).subscribe((res: any) => {
        this.dataSource = this.mappingData(res.tasks);
        this.total = res.totalItems;
      }
    );
  }

  // Loop on returning Data
  mappingData(data: any[]) {
    let newTasks = data.map((item) => {
      return {
        ...item,
        user: item.userId.username,
      };
    });
    console.log(newTasks);
    return newTasks;
  }


  // Update Task
  updateTask(element: any) {
    const dialogRef = this.dialog.open(AddTaskComponent, {
      width: '750px',
      data: element,
      disableClose: true,
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result == true) {
        this.getAllTasks();
      }
    });
  }


  // Add Task => ( Open Modal )
  addTask() {
    const dialogRef = this.dialog.open(AddTaskComponent, {
      width: '750px',
      disableClose: true,
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result == true) {
        this.getAllTasks();
      }
    });
  }


  // Delete Task
  deleteTask(id: any) {
    this.service.deleteTask(id).subscribe(
      (res) => {
        this.getAllTasks();
      }
    );
  }

  // pagination
  changePage(event: any) {
    this.page = event;
    this.filteration['page'] = event;
    this.getAllTasks();
  }
}
