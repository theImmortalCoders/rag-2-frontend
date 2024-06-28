import { ComponentFixture, TestBed } from '@angular/core/testing';
import { BaseGameComponent } from './base-game.component';
import { TMenuType } from '../../models/menu-type.enum';
import { TimeMenuComponent } from '../menu/time-menu.component';
import { EventMenuComponent } from '../menu/event-menu.component';
import { NgComponentOutlet } from '@angular/common';
import { Component } from '@angular/core';

@Component({ selector: 'app-dummy', template: '' })
class DummyComponent {}

describe('BaseGameComponent', () => {
  let component: BaseGameComponent;
  let fixture: ComponentFixture<BaseGameComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BaseGameComponent, NgComponentOutlet],
      declarations: [DummyComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BaseGameComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should set component based on menuType', () => {
    component.menuType = 'TIME';
    component.ngOnInit();
    expect(component.component).toEqual(TimeMenuComponent);
  });

  it('should set null component when menuType is not recognized', () => {
    component.menuType = 'INVALID_TYPE' as TMenuType; // Type assertion for invalid type
    component.ngOnInit();
    expect(component.component).toBeNull();
  });

  it('should render TimeMenuComponent when menuType is TIME', () => {
    component.menuType = 'TIME';
    fixture.detectChanges();
    const compiled = fixture.nativeElement;
    expect(compiled.querySelector('app-time-menu')).not.toBeNull();
  });

  it('should render EventMenuComponent when menuType is EVENT', () => {
    component.menuType = 'EVENT';
    fixture.detectChanges();
    const compiled = fixture.nativeElement;
    expect(compiled.querySelector('app-event-menu')).not.toBeNull();
  });

  // Add more tests as needed to cover other scenarios
});
