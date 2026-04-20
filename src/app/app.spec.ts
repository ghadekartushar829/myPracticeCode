import { TestBed } from '@angular/core/testing';
import { App } from './app';
import { DemoService } from './demo';
import { of } from 'rxjs';

describe('App', () => {
  beforeEach(async () => {
    const demoServiceSpy = jasmine.createSpyObj('DemoService', ['getItems', 'addItem', 'deleteItem', 'updateItem']);
    demoServiceSpy.getItems.and.returnValue(of([]));

    await TestBed.configureTestingModule({
      imports: [App],
      providers: [{ provide: DemoService, useValue: demoServiceSpy }]
    }).compileComponents();
  });

  it('should create the app', () => {
    const fixture = TestBed.createComponent(App);
    const app = fixture.componentInstance;
    expect(app).toBeTruthy();
  });

  it('should render title', () => {
    const fixture = TestBed.createComponent(App);
    fixture.detectChanges();
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('app-demo')).toBeTruthy();
  });
});
