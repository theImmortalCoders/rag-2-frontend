import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AiSocketMenuComponent } from './ai-socket-menu.component';

describe('AiSocketMenuComponent', () => {
  let component: AiSocketMenuComponent;
  let fixture: ComponentFixture<AiSocketMenuComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AiSocketMenuComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AiSocketMenuComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize socket to null', () => {
    expect(component.socket).toBeNull();
  });

  it('should emit logData when logDataEmitter is called', () => {
    const logData = { message: 'Test log message' };
    spyOn(component.logDataEmitter, 'emit');
    component.logDataEmitter.emit(logData);
    expect(component.logDataEmitter.emit).toHaveBeenCalledWith(logData);
  });

  it('should connect to the socket when connect is called', () => {
    const socketDomain = 'ws://localhost:8080/';
    component.connect(socketDomain);
    expect(component.socket).not.toBeNull();
    expect(component.socket?.url).toBe(socketDomain);
  });
});
