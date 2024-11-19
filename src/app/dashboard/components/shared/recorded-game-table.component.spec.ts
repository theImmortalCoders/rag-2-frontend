import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RecordedGameTableComponent } from './recorded-game-table.component';

describe('RecordedGameTableComponent', () => {
  let component: RecordedGameTableComponent;
  let fixture: ComponentFixture<RecordedGameTableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RecordedGameTableComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RecordedGameTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
