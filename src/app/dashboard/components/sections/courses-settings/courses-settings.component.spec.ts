import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CoursesSettingsComponent } from './courses-settings.component';

describe('CoursesSettingsComponent', () => {
  let component: CoursesSettingsComponent;
  let fixture: ComponentFixture<CoursesSettingsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CoursesSettingsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CoursesSettingsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
