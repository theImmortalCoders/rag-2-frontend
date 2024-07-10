import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SocketDomainInputComponent } from './socket-domain-input.component';

describe('SocketDomainInputComponent', () => {
  let component: SocketDomainInputComponent;
  let fixture: ComponentFixture<SocketDomainInputComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SocketDomainInputComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SocketDomainInputComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
