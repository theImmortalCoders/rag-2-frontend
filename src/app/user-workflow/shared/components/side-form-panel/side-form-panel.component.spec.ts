import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter, Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { Location } from '@angular/common';
import { Component } from '@angular/core';
import { SideFormPanelComponent } from './side-form-panel.component';

@Component({ template: '' })
class DummyComponent {}

describe('SideFormPanelComponent', () => {
  let component: SideFormPanelComponent;
  let fixture: ComponentFixture<SideFormPanelComponent>;
  let router: Router;
  let location: Location;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RouterTestingModule, SideFormPanelComponent],
      providers: [
        provideRouter([{ path: 'test-link', component: DummyComponent }]),
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SideFormPanelComponent);
    component = fixture.componentInstance;
    router = TestBed.inject(Router);
    location = TestBed.inject(Location);
    router.initialNavigation();
  });

  it('should create', () => {
    component.mainText = 'Main Text';
    component.routerLink = '/test-link';
    component.buttonText = 'Button Text';
    fixture.detectChanges();
    expect(component).toBeTruthy();
  });

  it('should render mainText', () => {
    component.mainText = 'Test Main Text';
    fixture.detectChanges();
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('h1')?.textContent).toContain(
      'Test Main Text'
    );
  });

  it('should render buttonText', () => {
    component.buttonText = 'Test Button Text';
    fixture.detectChanges();
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('button')?.textContent).toContain(
      'Test Button Text'
    );
  });

  it('should navigate to correct route on button click', async () => {
    component.routerLink = 'test-link';
    component.buttonText = 'Button Text';
    fixture.detectChanges();
    const button = fixture.nativeElement.querySelector(
      'button'
    ) as HTMLButtonElement;
    button.click();
    await fixture.whenStable();
    expect(location.path()).toBe('/test-link');
  });
});
