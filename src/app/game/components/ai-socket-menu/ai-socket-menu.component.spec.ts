import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { AiSocketMenuComponent } from './ai-socket-menu.component';
import { AiSocketService } from './services/ai-socket.service';
import { DebugModeMenuComponent } from './components/components/debug-mode-menu/debug-mode-menu.component';
import { DebugModePanelComponent } from './components/components/debug-mode-panel/debug-mode-panel.component';
import { TExchangeData } from 'app/game/models/exchange-data.type';
import { EventEmitter } from '@angular/core';
import { ActivatedRoute, convertToParamMap } from '@angular/router';
import { of } from 'rxjs';
import { HttpClient } from '@angular/common/http';

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
    };

    TestBed.configureTestingModule({
      imports: [
        AiSocketMenuComponent,
        DebugModeMenuComponent,
        DebugModePanelComponent,
      ],
      providers: [
        HttpClient,
        {
          provide: ActivatedRoute,
          useValue: {
            paramMap: of(convertToParamMap({ gameName: 'pong' })),
          },
        },
        { provide: AiSocketService, useValue: aiSocketServiceStub },
      ],
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
});
