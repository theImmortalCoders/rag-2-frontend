import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SocketConnectedMenuComponent } from './socket-connected-menu.component';

describe('SocketConnectedMenuComponent', () => {
  let component: SocketConnectedMenuComponent;
  let fixture: ComponentFixture<SocketConnectedMenuComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SocketConnectedMenuComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SocketConnectedMenuComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
