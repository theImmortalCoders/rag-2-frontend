import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConsoleComponent } from './console.component';

describe('ConsoleComponent', () => {
  let component: ConsoleComponent;
  let fixture: ComponentFixture<ConsoleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ConsoleComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(ConsoleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display log data correctly', () => {
    const testLogData = {
      '2023-04-01': { message: 'Test message 1', level: 'info' },
      '2023-04-02': { message: 'Test message 2', level: 'error' },
    };
    component.logData = testLogData;
    fixture.detectChanges();

    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelectorAll('p').length).toBeGreaterThan(2);
    expect(compiled.textContent).toContain('2023-04-01');
    expect(compiled.textContent).toContain('Test message 1');
    expect(compiled.textContent).toContain('2023-04-02');
    expect(compiled.textContent).toContain('Test message 2');
  });
});
