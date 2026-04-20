import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { of } from 'rxjs';

import { Demo } from './demo';
import { DemoService } from '../demo';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';

describe('Demo', () => {
  let component: Demo;
  let fixture: ComponentFixture<Demo>;
  let demoServiceSpy: jasmine.SpyObj<DemoService>;

  beforeEach(async () => {
    const spy = jasmine.createSpyObj('DemoService', ['getItems', 'addItem', 'deleteItem', 'updateItem']);

    await TestBed.configureTestingModule({
      imports: [Demo, ReactiveFormsModule],
      providers: [{ provide: DemoService, useValue: spy }, provideHttpClient(),
        provideHttpClientTesting(),]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Demo);
    component = fixture.componentInstance;
    demoServiceSpy = TestBed.inject(DemoService) as jasmine.SpyObj<DemoService>;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize and call getData on ngOnInit', () => {
    demoServiceSpy.getItems.and.returnValue(of([]));
    component.ngOnInit();
    expect(demoServiceSpy.getItems).toHaveBeenCalled();
  });

  it('should get data and set dataSource', () => {
    const mockData: any[] = [
      { id: 1, name: 'Tushar', username: 'tusharg', email: 'tushar@example.com', phone: '123-456-7890' }
    ];
    demoServiceSpy.getItems.and.returnValue(of(mockData));

    component.getData();

    expect(demoServiceSpy.getItems).toHaveBeenCalled();
    expect(component.dataSource).toEqual(mockData);
  });

  it('should submit form and add item', () => {
    const formValue = {
      name: 'Jane Doe',
      username: 'janedoe',
      email: 'jane@example.com',
      gender: 'female'
    };
    component.signupForm.setValue(formValue);
    demoServiceSpy.addItem.and.returnValue(of({}));
    demoServiceSpy.getItems.and.returnValue(of([]));

    spyOn(component.signupForm, 'reset');

    component.onSubmit();

    expect(demoServiceSpy.addItem).toHaveBeenCalledWith({
      ...formValue,
      password: 'pass123'
    });
    expect(component.signupForm.reset).toHaveBeenCalled();
    expect(demoServiceSpy.getItems).toHaveBeenCalled();
  });

  it('should delete row', () => {
    const row = { id: 1, name: 'John' };
    demoServiceSpy.deleteItem.and.returnValue(of({}));
    demoServiceSpy.getItems.and.returnValue(of([]));

    spyOn(window, 'alert');

    component.deleteRow(row);

    expect(demoServiceSpy.deleteItem).toHaveBeenCalledWith(1);
    expect(window.alert).toHaveBeenCalledWith('Deleted!!');
    expect(demoServiceSpy.getItems).toHaveBeenCalled();
  });

  it('should update row', () => {
    const row = { id: 1, name: 'Updated Name' };
    demoServiceSpy.updateItem.and.returnValue(of({}));
    demoServiceSpy.getItems.and.returnValue(of([]));

    spyOn(window, 'alert');

    component.updateRow(row);

    expect(demoServiceSpy.updateItem).toHaveBeenCalledWith(1, row);
    expect(window.alert).toHaveBeenCalledWith('Updated!!');
    expect(demoServiceSpy.getItems).toHaveBeenCalled();
  });

  it('should have invalid form when fields are empty', () => {
    expect(component.signupForm.valid).toBeFalsy();
    expect(component.signupForm.get('name')?.valid).toBeFalsy();
    expect(component.signupForm.get('username')?.valid).toBeFalsy();
    expect(component.signupForm.get('email')?.valid).toBeFalsy();
    expect(component.signupForm.get('gender')?.valid).toBeFalsy();
  });

  it('should validate required fields', () => {
    component.signupForm.get('name')?.setValue('Test Name');
    component.signupForm.get('username')?.setValue('testuser');
    component.signupForm.get('email')?.setValue('test@example.com');
    component.signupForm.get('gender')?.setValue('male');

    expect(component.signupForm.valid).toBeTruthy();
  });

  it('should validate email format', () => {
    const emailControl = component.signupForm.get('email');
    emailControl?.setValue('invalid-email');
    expect(emailControl?.invalid).toBeTruthy();

    emailControl?.setValue('valid@example.com');
    expect(emailControl?.valid).toBeTruthy();
  });

  it('should have correct displayed columns', () => {
    expect(component.displayedColumns).toEqual(['id', 'name', 'username', 'email', 'actions']);
  });

  it('should have genders array', () => {
    expect(component.genders).toEqual(['male', 'female']);
  });
});
