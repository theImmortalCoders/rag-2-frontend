import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PlayerSocketMenuComponent } from './player-socket-menu.component';

describe('PlayerSocketMenuComponent', () => {
  let component: PlayerSocketMenuComponent;
  let fixture: ComponentFixture<PlayerSocketMenuComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PlayerSocketMenuComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(PlayerSocketMenuComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
