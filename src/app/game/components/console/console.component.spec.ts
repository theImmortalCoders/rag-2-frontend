import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Component } from '@angular/core';
import { By } from '@angular/platform-browser';
import { ConsoleComponent } from './console.component';
import { KeyValuePipe } from '@angular/common';
import { ExchangeDataPipe } from '@utils/pipes/exchange-data.pipe';
import { TExchangeData } from '../../models/exchange-data.type';

describe('ConsoleComponent', () => {
  let component: ConsoleComponent;
  let fixture: ComponentFixture<ConsoleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ConsoleComponent, KeyValuePipe, ExchangeDataPipe], // Import standalone component here
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ConsoleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display logData keys and values correctly', () => {
    const testData: TExchangeData = {
      key1: 'value1',
      key2: 'value2',
      nested: {
        nestedKey1: 'nestedValue1',
      },
    };

    component.logData = testData;
    fixture.detectChanges();

    const compiled = fixture.nativeElement;
    expect(compiled.textContent).toContain('key1:');
    expect(compiled.textContent).toContain('value1');
    expect(compiled.textContent).toContain('key2:');
    expect(compiled.textContent).toContain('value2');
    expect(compiled.textContent).toContain('nestedKey1:');
    expect(compiled.textContent).toContain('nestedValue1');
  });

  it('should call isTLogData correctly', () => {
    const testValue = { someKey: 'someValue' };
    spyOn(component, 'isTLogData').and.callThrough();

    expect(component.isTLogData(testValue)).toBeTrue();
    expect(component.isTLogData('string')).toBeFalse();
    expect(component.isTLogData(123)).toBeFalse();
    expect(component.isTLogData([1, 2, 3])).toBeTrue();
    expect(component.isTLogData(null)).toBeFalse();
  });
});
