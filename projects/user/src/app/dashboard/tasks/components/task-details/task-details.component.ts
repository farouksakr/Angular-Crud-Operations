import { Component, OnInit } from '@angular/core';
import { TasksService } from '../../services/tasks.service';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-task-details',
  templateUrl: './task-details.component.html',
  styleUrls: ['./task-details.component.scss'],
})
export class TaskDetailsComponent implements OnInit {

  taskId: any;
  taskDetails: any;

  constructor(
    private route: ActivatedRoute,
    private service: TasksService,
    private router: Router
  ) {
    this.route.paramMap.subscribe((res: any) => {
      this.taskId = res.params['id'];
    });
  }

  ngOnInit(): void {
    this.getTaskDetails();
  }

  getTaskDetails() {
    this.service.taskDetails(this.taskId).subscribe((res: any) => {
      this.taskDetails = res.tasks
    });
  }

  complete() {
    const model = {
      id: this.taskId
    }
    this.service.completeTask(model).subscribe((res) => {
      this.router.navigate(['/tasks']);
    })
  }
}
