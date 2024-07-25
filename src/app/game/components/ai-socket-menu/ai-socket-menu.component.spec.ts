import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { AiSocketMenuComponent } from './ai-socket-menu.component';
import { AiSocketService } from './services/ai-socket.service';
import { DebugModeMenuComponent } from './components/debug-mode-menu/debug-mode-menu.component';
import { DebugModePanelComponent } from './components/debug-mode-panel/debug-mode-panel.component';
import { TExchangeData } from 'app/game/models/exchange-data.type';
import { EventEmitter } from '@angular/core';

describe('AiSocketMenuComponent', () => {
  let component: AiSocketMenuComponent;
  let fixture: ComponentFixture<AiSocketMenuComponent>;
  let aiSocketServiceStub: Partial<AiSocketService>;
  let socketService: AiSocketService;

  beforeEach(waitForAsync(() => {
    aiSocketServiceStub = {
      getIsSocketConnected: jasmine
        .createSpy('getIsSocketConnected')
        .and.returnValue(false),
      getIsDataSendingActive: jasmine
        .createSpy('getIsDataSendingActive')
        .and.returnValue(false),
      getSocket: jasmine.createSpy('getSocket').and.returnValue({
        close: jasmine.createSpy('close'),
      } as unknown as WebSocket),
      stopDataExchange: jasmine.createSpy('stopDataExchange'),
      startDataExchange: jasmine.createSpy('startDataExchange'),
      connect: jasmine
        .createSpy('connect')
        .and.callFake((_url, onOpen, _onMessage, _onClose) => {
          onOpen();
        }),
      sendDataToSocket: jasmine.createSpy('sendDataToSocket'),
    };

    TestBed.configureTestingModule({
      imports: [
        AiSocketMenuComponent,
        DebugModeMenuComponent,
        DebugModePanelComponent,
      ],
      providers: [{ provide: AiSocketService, useValue: aiSocketServiceStub }],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AiSocketMenuComponent);
    component = fixture.componentInstance;
    socketService = TestBed.inject(AiSocketService);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display "Connect" button when socket is not connected', () => {
    (socketService.getIsSocketConnected as jasmine.Spy).and.returnValue(false);
    fixture.detectChanges();
    const button = fixture.debugElement.query(By.css('button')).nativeElement;
    expect(button.textContent).toContain('Connect');
  });

  it('should display "Disconnect" button when socket is connected', () => {
    (socketService.getIsSocketConnected as jasmine.Spy).and.returnValue(true);
    fixture.detectChanges();
    const button = fixture.debugElement.query(By.css('button')).nativeElement;
    expect(button.textContent).toContain('Disconnect');
  });

  it('should call connect method when "Connect" button is clicked', () => {
    (socketService.getIsSocketConnected as jasmine.Spy).and.returnValue(false);
    fixture.detectChanges();
    const button = fixture.debugElement.query(By.css('button')).nativeElement;
    button.click();
    expect(socketService.connect).toHaveBeenCalled();
  });

  it('should call disconnect method when "Disconnect" button is clicked', () => {
    (socketService.getIsSocketConnected as jasmine.Spy).and.returnValue(true);
    fixture.detectChanges();
    const button = fixture.debugElement.query(By.css('button')).nativeElement;
    button.click();
    expect(socketService.getSocket()?.close).toHaveBeenCalled();
  });

  it('should emit logData when socket connects', () => {
    spyOn(component.logDataEmitter, 'emit');
    (socketService.getIsSocketConnected as jasmine.Spy).and.returnValue(false);
    fixture.detectChanges();
    const button = fixture.debugElement.query(By.css('button')).nativeElement;
    button.click();
    expect(component.logDataEmitter.emit).toHaveBeenCalled();
  });

  it('should load recent phrases on init', () => {
    const phrases = ['ws://localhost1', 'ws://localhost2'];
    spyOn(localStorage, 'getItem').and.returnValue(JSON.stringify(phrases));
    component.ngOnInit();
    expect(component.recentPhrases).toEqual(phrases);
  });

  it('should toggle debug mode', () => {
    const debugMenu = fixture.debugElement.query(
      By.directive(DebugModeMenuComponent)
    );
    debugMenu.triggerEventHandler('debugModeEmitter', true);
    fixture.detectChanges();
    expect(component.isDebugModeActive).toBe(true);
  });
});
