import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TictactoeGameWindowComponent } from './tictactoe.component';

describe('TictactoeComponent', () => {
  let component: TictactoeGameWindowComponent;
  let fixture: ComponentFixture<TictactoeGameWindowComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TictactoeGameWindowComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(TictactoeGameWindowComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
