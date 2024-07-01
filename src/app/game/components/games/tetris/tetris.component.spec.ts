import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TetrisGameWindowComponent } from './tetris.component';

describe('TetrisComponent', () => {
  let component: TetrisGameWindowComponent;
  let fixture: ComponentFixture<TetrisGameWindowComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TetrisGameWindowComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(TetrisGameWindowComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
