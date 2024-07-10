import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DataCollectingToggleButtonComponent } from './collect-toggle-button.component';

describe('ToggleButtonComponent', () => {
  let component: DataCollectingToggleButtonComponent;
  let fixture: ComponentFixture<DataCollectingToggleButtonComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DataCollectingToggleButtonComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(DataCollectingToggleButtonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
