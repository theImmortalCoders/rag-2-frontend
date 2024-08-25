import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PlayerMenuComponent } from './player-menu.component';

describe('PlayerMenuComponent', () => {
  let component: PlayerMenuComponent;
  let fixture: ComponentFixture<PlayerMenuComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PlayerMenuComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PlayerMenuComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
