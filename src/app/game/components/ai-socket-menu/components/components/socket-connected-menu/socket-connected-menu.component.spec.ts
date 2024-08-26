import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { SocketConnectedMenuComponent } from './socket-connected-menu.component';

describe('SocketConnectedMenuComponent', () => {
  let component: SocketConnectedMenuComponent;
  let fixture: ComponentFixture<SocketConnectedMenuComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SocketConnectedMenuComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(SocketConnectedMenuComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display "Start data exchange" button when data sending is not active', () => {
    component.isDataSendingActive = false;
    fixture.detectChanges();
    const button = fixture.debugElement.query(By.css('button')).nativeElement;
    expect(button.textContent).toContain('Start data exchange');
  });

  it('should display "Stop data exchange" button when data sending is active', () => {
    component.isDataSendingActive = true;
    fixture.detectChanges();
    const button = fixture.debugElement.query(By.css('button')).nativeElement;
    expect(button.textContent).toContain('Stop data exchange');
  });

  it('should call startDataExchange when "Start data exchange" button is clicked', () => {
    spyOn(component, 'startDataExchange');
    component.isDataSendingActive = false;
    fixture.detectChanges();
    const button = fixture.debugElement.query(By.css('button'));
    button.triggerEventHandler('click', null);
    expect(component.startDataExchange).toHaveBeenCalled();
  });

  it('should call stopDataExchange when "Stop data exchange" button is clicked', () => {
    spyOn(component, 'stopDataExchange');
    component.isDataSendingActive = true;
    fixture.detectChanges();
    const button = fixture.debugElement.query(By.css('button'));
    button.triggerEventHandler('click', null);
    expect(component.stopDataExchange).toHaveBeenCalled();
  });
});
