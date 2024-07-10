import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AiSocketMenuComponent } from './ai-socket-menu.component';

describe('AiSocketMenuComponent', () => {
  let component: AiSocketMenuComponent;
  let fixture: ComponentFixture<AiSocketMenuComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AiSocketMenuComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(AiSocketMenuComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
