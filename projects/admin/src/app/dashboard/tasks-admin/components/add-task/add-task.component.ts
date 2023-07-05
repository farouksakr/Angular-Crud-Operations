import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import * as moment from 'moment';
import { TasksService } from './../../services/tasks.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { ConfirmationComponent } from '../confirmation/confirmation.component';
import { UsersService } from '../../../manage-users/services/users.service';

@Component({
  selector: 'app-add-task',
  templateUrl: './add-task.component.html',
  styleUrls: ['./add-task.component.scss'],
})
export class AddTaskComponent implements OnInit {
  constructor(
    // to send data in updata function after open dialoge
    @Inject(MAT_DIALOG_DATA) public data: any,
    private fb: FormBuilder,
    public dialog: MatDialogRef<AddTaskComponent>,
    public matDialog: MatDialog,
    private service: TasksService,
    private spinner: NgxSpinnerService,
    private userService: UsersService,
  ) {
    this.getDataFromSubject();
  }

  users: any = [];

  newTaskForm!: FormGroup;
  fileName!: '';
  formValues: any;

  ngOnInit(): void {
    console.log(this.data);

    this.createForm();
  }

  getDataFromSubject() {
    this.userService.userData.subscribe((res: any) => {
      this.users = this.usersMapping(res.data);
    })
  }

  usersMapping(data: any[]) {
    let newArray = data?.map(item => {
      return {
        name : item.username,
        id: item._id
      }
    })
    console.log(newArray);

    return newArray;
  }

  createForm() {
    this.newTaskForm = this.fb.group({
      title: [this.data?.title || '', [Validators.required, Validators.minLength(5)]],
      userId: [this.data?.userId?._id || '', Validators.required],
      image: [this.data?.image || '', Validators.required],
      description: [this.data?.description || '', Validators.required],
      deadline: [this.data ? new Date(this.data?.deadline.split('-').reverse().join('-')).toISOString() : '', Validators.required],
    });
    this.formValues = this.newTaskForm.value;
  }

  selectImage(event: any) {
    this.fileName = event.target.value;
    this.newTaskForm.get('image')?.setValue(event.target.files[0]);
  }

  createTask() {
    let model = this.prepareFormData();
    this.service.addTask(model).subscribe(
      (res: any) => {
        console.log('Create Task Ok', res);
        this.dialog.close(true);
      },
      (err) => {
        console.log('Create Task Err', err.error.message);
      }
    );
  }

  updateTask() {
    let model = this.prepareFormData();
    this.service.updateTask(model, this.data._id).subscribe(
      (res: any) => {
        console.log('update Task Ok', res);
        this.dialog.close(true);
      },
      (err) => {
        console.log('update Task Err', err.error.message);
      }
    );
  }

  prepareFormData() {
    // to formate date
    let newData = moment(this.newTaskForm.value['deadline']).format('DD-MM-YYYY');

    // set data in form data to backend
    let formData = new FormData();
    Object.entries(this.newTaskForm.value).forEach(([key, value]: any) => {
      if (key == 'deadline') {
        formData.append(key, newData);
      } else {
        formData.append(key, value);
      }
    });
    return formData;
  }

  // check before closing dialoge if there are changes or not
  close() {
    let hasChanges = false;
    Object.keys(this.formValues).forEach((item)=> {
      if(this.formValues[item] !== this.newTaskForm.value[item]) {
        hasChanges = true;
      }
    })

    if(hasChanges) {
      const dialogRef = this.matDialog.open(ConfirmationComponent, {
        width: '550px'
      });

      dialogRef.afterClosed().subscribe((result) => {
        if (result == true) {

        }
      });
    } else {
      this.dialog.close()
    }
  }
}
