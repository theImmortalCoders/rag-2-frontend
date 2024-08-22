import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RegisterConfirmComponent } from './register-confirm.component';

describe('RegisterConfirmComponent', () => {
  let component: RegisterConfirmComponent;
  let fixture: ComponentFixture<RegisterConfirmComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RegisterConfirmComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RegisterConfirmComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
