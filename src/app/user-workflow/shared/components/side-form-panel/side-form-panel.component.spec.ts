import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SideFormPanelComponent } from './side-form-panel.component';

describe('SideFormPanelComponent', () => {
  let component: SideFormPanelComponent;
  let fixture: ComponentFixture<SideFormPanelComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SideFormPanelComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SideFormPanelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
