import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ImageGallary } from './image-gallary';

describe('ImageGallary', () => {
  let component: ImageGallary;
  let fixture: ComponentFixture<ImageGallary>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ImageGallary]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ImageGallary);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
