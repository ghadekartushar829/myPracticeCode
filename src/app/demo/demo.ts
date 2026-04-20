import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormGroup, FormControl, Validators, FormArray, ReactiveFormsModule, FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatRadioModule } from '@angular/material/radio';
import { MatTableModule } from '@angular/material/table';
import { DemoService } from '../demo';
import { MatIconModule } from '@angular/material/icon';

export interface UserData {
  name: string;
  email: string;
  username: string;
  phone: string;
}

@Component({
  selector: 'app-demo',
  imports: [ReactiveFormsModule, FormsModule, CommonModule, MatFormFieldModule, MatInputModule, MatRadioModule, MatButtonModule, MatTableModule, MatIconModule],
  templateUrl: './demo.html',
  styleUrl: './demo.scss'
})
export class Demo {
  tableData: UserData[] = [];

  genders = ['male', 'female'];
  signupForm = new FormGroup({
    name: new FormControl('', [Validators.required]),
    username: new FormControl('', [Validators.required]),
    email: new FormControl('', [Validators.required, Validators.email]),
    gender: new FormControl('', [Validators.required])
  });

  displayedColumns: string[] = ['id', 'name', 'username', 'email', 'actions'];
  dataSource = this.tableData;

  private demoSer = inject(DemoService)

  ngOnInit() {
    this.getData();
  }

  onSubmit() {
    const user = { ...this.signupForm.value, password: 'pass123' };
    this.demoSer.addItem(user).subscribe(res => {
      this.getData();
      this.signupForm.reset();
    });
    console.log(this.signupForm.value);
  }

  getData() {
    this.demoSer.getItems().subscribe(res => {
      this.dataSource = res;
    });
  }

  deleteRow(row: any) {
    console.log(row);
    this.demoSer.deleteItem(row.id).subscribe(res => {
      alert('Deleted!!');
      this.getData();
    })
  }

   updateRow(row: any) {
    console.log(row);
    this.demoSer.updateItem(row.id, row).subscribe(res => {
      alert('Updated!!');
      this.getData();
    })
  }
}
