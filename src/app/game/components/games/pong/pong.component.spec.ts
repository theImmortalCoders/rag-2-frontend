import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PongGameWindowComponent } from './pong.component';

describe('PongComponent', () => {
  let component: PongGameWindowComponent;
  let fixture: ComponentFixture<PongGameWindowComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PongGameWindowComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(PongGameWindowComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
