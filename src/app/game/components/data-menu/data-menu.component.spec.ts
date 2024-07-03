import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DataMenuComponent } from './data-menu.component';

describe('DataMenuComponent', () => {
  let component: DataMenuComponent;
  let fixture: ComponentFixture<DataMenuComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DataMenuComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DataMenuComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
