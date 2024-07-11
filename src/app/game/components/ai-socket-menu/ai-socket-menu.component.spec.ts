import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AiSocketMenuComponent } from './ai-socket-menu.component';
import { By } from '@angular/platform-browser';
import { AiSocketService } from './services/ai-socket.service';

describe('AiSocketMenuComponent', () => {
  let component: AiSocketMenuComponent;
  let fixture: ComponentFixture<AiSocketMenuComponent>;
  let aiSocketServiceStub: Partial<AiSocketService>;

  beforeEach(async () => {
    aiSocketServiceStub = {
      getIsSocketConnected: (): boolean => true,
      getIsDataSendingActive: (): boolean => false,
      getSocket: (): WebSocket | null => ({}) as WebSocket,
      stopDataExchange: (): void => {
        void 0;
      },
    };

    await TestBed.configureTestingModule({
      imports: [AiSocketMenuComponent],
      providers: [{ provide: AiSocketService, useValue: aiSocketServiceStub }],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AiSocketMenuComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display "Connected" when socket is connected', () => {
    const statusSpan = fixture.debugElement.query(By.css('span')).nativeElement;
    expect(statusSpan.textContent).toContain('Connected');
  });

  it('should display "Connect" button when socket is not connected', () => {
    aiSocketServiceStub.getIsSocketConnected = (): boolean => false;
    fixture.detectChanges();
    const button = fixture.debugElement.query(By.css('button')).nativeElement;
    expect(button.textContent).toContain('Connect');
  });
});
