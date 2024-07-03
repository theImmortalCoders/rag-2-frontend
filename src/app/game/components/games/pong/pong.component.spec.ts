import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PongGameWindowComponent } from './pong.component';

describe('PongComponent', () => {
  let component: PongGameWindowComponent;
  let fixture: ComponentFixture<PongGameWindowComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PongGameWindowComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(PongGameWindowComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should update gameWindowLogData.pong on updateInputData call', () => {
    const testValue = 'Test Pong Data';
    component.updateInputData(testValue);
    expect(component.gameWindowLogData['output']['pong']).toEqual(testValue);
  });

  it('should update gameWindowLogData.pong when input element value changes', () => {
    const inputElement: HTMLInputElement =
      fixture.nativeElement.querySelector('input');
    const testValue = 'New Pong Data';
    inputElement.value = testValue;
    inputElement.dispatchEvent(new Event('input'));
    fixture.detectChanges();
    expect(component.gameWindowLogData['output']['pong']).toEqual(testValue);
  });
});
