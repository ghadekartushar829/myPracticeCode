import { CommonModule } from '@angular/common';
import { Component, inject, OnInit, signal } from '@angular/core';
import { FormGroup, FormControl, Validators, FormArray, ReactiveFormsModule, FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatRadioModule } from '@angular/material/radio';
import { MatTableModule } from '@angular/material/table';
import { DemoService } from '../demo';
import { MatIconModule } from '@angular/material/icon';
import { switchMap } from 'rxjs/operators';

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
export class Demo implements OnInit {
  tableData = signal<UserData[]>([]);

  genders = ['male', 'female'];
  signupForm = new FormGroup({
    name: new FormControl('', [Validators.required]),
    username: new FormControl('', [Validators.required]),
    email: new FormControl('', [Validators.required, Validators.pattern(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/)]),
    gender: new FormControl('', [Validators.required])
  });

  displayedColumns: string[] = ['id', 'name', 'username', 'email', 'actions'];
  dataSource = signal<UserData[]>([]);

  private demoSer = inject(DemoService)

  ngOnInit() {
    this.getData();
  }

  onSubmit() {
    const user = { ...this.signupForm.value, password: 'pass123' };
    this.demoSer.addItem(user).pipe(
      switchMap(() => this.demoSer.getItems())
    ).subscribe({
      next: res => {
        this.dataSource.set(res);
        this.signupForm.reset();
      },
      error: err => {
        console.error('Error adding user:', err);
        alert('Failed to add user. Please try again.');
      }
    });
    console.log(this.signupForm.value);
  }

  getData() {
    this.demoSer.getItems().subscribe({
      next: res => {
        this.dataSource.set(res);
      },
      error: err => {
        console.error('Error loading data:', err);
        alert('Failed to load data. Please refresh the page.');
      }
    });
  }

  deleteRow(row: any) {
    console.log(row);
    this.demoSer.deleteItem(row.id).pipe(
      switchMap(() => this.demoSer.getItems())
    ).subscribe({
      next: res => {
        this.dataSource.set(res);
        alert('Deleted!!');
      },
      error: err => {
        console.error('Error deleting user:', err);
        alert('Failed to delete user. Please try again.');
      }
    });
  }

   updateRow(row: any) {
    console.log(row);
    this.demoSer.updateItem(row.id, row).pipe(
      switchMap(() => this.demoSer.getItems())
    ).subscribe({
      next: res => {
        this.dataSource.set(res);
        alert('Updated!!');
      },
      error: err => {
        console.error('Error updating user:', err);
        alert('Failed to update user. Please try again.');
      }
    });
  }
}
