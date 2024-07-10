import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DataCollectingToggleButtonComponent } from './collect-toggle-button.component';

describe('DataCollectingToggleButtonComponent', () => {
  let component: DataCollectingToggleButtonComponent;
  let fixture: ComponentFixture<DataCollectingToggleButtonComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DataCollectingToggleButtonComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(DataCollectingToggleButtonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should toggle data collecting state', () => {
    const button = fixture.debugElement.query(By.css('button')).nativeElement;
    expect(component.vIsDataCollectingActive.value).toBeFalse();
    button.click();
    expect(component.vIsDataCollectingActive.value).toBeTrue();
    button.click();
    expect(component.vIsDataCollectingActive.value).toBeFalse();
  });

  it('should display correct button text', () => {
    const button = fixture.debugElement.query(By.css('button')).nativeElement;
    fixture.detectChanges();
    expect(button.textContent.trim()).toBe('Start collecting data');
    button.click();
    fixture.detectChanges();
    expect(button.textContent.trim()).toBe('Stop collecting data');
  });
});
