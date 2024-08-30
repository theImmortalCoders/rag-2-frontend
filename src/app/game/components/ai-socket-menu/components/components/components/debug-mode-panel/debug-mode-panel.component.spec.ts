import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DebugModePanelComponent } from './debug-mode-panel.component';

describe('DebugModePanelComponent', () => {
  let component: DebugModePanelComponent;
  let fixture: ComponentFixture<DebugModePanelComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DebugModePanelComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(DebugModePanelComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize input with expectedInput', () => {
    const mockInput = { key1: 'value1', key2: 'value2' };
    component.expectedInput = mockInput;
    component.ngOnInit();
    expect(component.inputData).toEqual(mockInput);
  });

  it('should emit input data when emitInputData is called', () => {
    const spy = spyOn(component.inputEmitter, 'emit');
    const mockKey = 'testKey';
    const mockValue = 'testValue';
    component.emitInputData(mockKey, mockValue);
    expect(spy).toHaveBeenCalledWith({ [mockKey]: mockValue });
  });
});
