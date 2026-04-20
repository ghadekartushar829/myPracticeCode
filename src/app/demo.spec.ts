import { TestBed } from '@angular/core/testing';

import { DemoService } from './demo';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { provideHttpClient } from '@angular/common/http';
import { UserData } from './demo/demo';

describe('DemoService', () => {
  let service: DemoService;
  let httpController: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        DemoService,
        provideHttpClient(),
        provideHttpClientTesting(),
      ],
    });
    service = TestBed.inject(DemoService);
    httpController = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpController.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should fetch users (GET)', () => {
    const mockData: UserData[] = [
      {
        name: 'Test User',
        email: 'test@example.com',
        username: 'testuser',
        phone: '123-456-7890'
      }
    ];

    service.getItems().subscribe(data => {
      expect(data).toEqual(mockData);
    });

    const req = httpController.expectOne('https://fakestoreapi.com/users');
    expect(req.request.method).toBe('GET');
    req.flush(mockData);
  });

  it('should add a user (POST)', () => {
    const newUser = {
      name: 'New User',
      email: 'new@example.com',
      username: 'newuser',
      phone: '098-765-4321',
      password: 'pass123'
    };
    const mockResponse = { id: 1, ...newUser };

    service.addItem(newUser).subscribe(response => {
      expect(response).toEqual(mockResponse);
    });

    const req = httpController.expectOne('https://fakestoreapi.com/users');
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual(newUser);
    req.flush(mockResponse);
  });

  it('should update a user (PUT)', () => {
    const userId = 1;
    const updatedUser = {
      name: 'Updated User',
      email: 'updated@example.com',
      username: 'updateduser',
      phone: '111-222-3333'
    };
    const mockResponse = { id: userId, ...updatedUser };

    service.updateItem(userId, updatedUser).subscribe(response => {
      expect(response).toEqual(mockResponse);
    });

    const req = httpController.expectOne(`https://fakestoreapi.com/users/${userId}`);
    expect(req.request.method).toBe('PUT');
    expect(req.request.body).toEqual(updatedUser);
    req.flush(mockResponse);
  });

  it('should delete a user (DELETE)', () => {
    const userId = 1;
    const mockResponse = {};

    service.deleteItem(userId).subscribe(response => {
      expect(response).toEqual(mockResponse);
    });

    const req = httpController.expectOne(`https://fakestoreapi.com/users/${userId}`);
    expect(req.request.method).toBe('DELETE');
    req.flush(mockResponse);
  });
});
