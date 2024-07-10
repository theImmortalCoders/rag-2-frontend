import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DataSelectCheckboxComponent } from './data-select-checkbox.component';

describe('DataSelectCheckboxComponent', () => {
  let component: DataSelectCheckboxComponent;
  let fixture: ComponentFixture<DataSelectCheckboxComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DataSelectCheckboxComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DataSelectCheckboxComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
