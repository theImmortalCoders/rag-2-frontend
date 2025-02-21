import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SingleDocComponent } from './single-doc.component';

describe('SingleDocComponent', () => {
  let component: SingleDocComponent;
  let fixture: ComponentFixture<SingleDocComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SingleDocComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SingleDocComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
