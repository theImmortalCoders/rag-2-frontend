import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ProgressCircleBarComponent } from './progress-circle-bar.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';

describe('ProgressCircleBarComponent', () => {
  let component: ProgressCircleBarComponent;
  let fixture: ComponentFixture<ProgressCircleBarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProgressCircleBarComponent, HttpClientTestingModule],
    }).compileComponents();

    fixture = TestBed.createComponent(ProgressCircleBarComponent);
    component = fixture.componentInstance;
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should set usedSpace and totalSpace correctly', () => {
    component.usedSpace = 20;
    component.totalSpace = 100;

    fixture.detectChanges();

    expect(component.usedSpace).toEqual(20);
    expect(component.totalSpace).toEqual(100);
  });

  it('should return correct stroke color based on usedSpace', () => {
    component.usedSpace = 50;
    component.totalSpace = 100;

    const strokeColor = component.getStrokeColor();

    expect(strokeColor).toEqual('rgb(128, 128, 0)');
  });

  it('should return default stroke color when usedSpace is undefined', () => {
    component.usedSpace = undefined;

    const strokeColor = component.getStrokeColor();

    expect(strokeColor).toEqual('rgb(0, 255, 0)');
  });
});
