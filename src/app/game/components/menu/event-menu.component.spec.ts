import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EventMenuComponent } from './event-menu.component';

describe('EventMenuComponent', () => {
  let component: EventMenuComponent;
  let fixture: ComponentFixture<EventMenuComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EventMenuComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EventMenuComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
