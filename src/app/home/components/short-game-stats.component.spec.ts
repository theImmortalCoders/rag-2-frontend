import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ShortGameStatsComponent } from './short-game-stats.component';

describe('ShortGameStatsComponent', () => {
  let component: ShortGameStatsComponent;
  let fixture: ComponentFixture<ShortGameStatsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ShortGameStatsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ShortGameStatsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
