import { TestBed } from '@angular/core/testing';

import { DemoService } from './demo';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { provideHttpClient } from '@angular/common/http';
import { UserData } from './demo/demo';

describe('Demo', () => {
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

  it('should fetch data (GET)', () => {
    const mockData:UserData = {
      name: 'Test', 
      email: "kevin@gmail.com",
      username: "kevinryan",
      phone: "2334567"
    };
    service.getItems().subscribe(data => expect(data).toEqual([mockData]));

    const req = httpController.expectOne('https://fakestoreapi.com/users');
    expect(req.request.method).toBe('GET');
    req.flush(mockData); // Simulates server response
  });

});
