import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RegisterPageComponent } from './register.page.component';
import { RegisterFormComponent } from './components/register-form.component';
import { BenefitsListComponent } from '../shared/components/benefits-list/benefits-list.component';
import { SideFormPanelComponent } from '../shared/components/side-form-panel/side-form-panel.component';
import { RouterTestingModule } from '@angular/router/testing';
import { By } from '@angular/platform-browser';

describe('RegisterPageComponent', () => {
  let component: RegisterPageComponent;
  let fixture: ComponentFixture<RegisterPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        RouterTestingModule,
        RegisterFormComponent,
        BenefitsListComponent,
        SideFormPanelComponent,
      ],
      declarations: [RegisterPageComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RegisterPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render RegisterFormComponent', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('app-register-form')).not.toBeNull();
  });

  it('should render SideFormPanelComponent with correct inputs', () => {
    const sideFormPanelElement = fixture.debugElement.query(
      By.directive(SideFormPanelComponent)
    );
    expect(sideFormPanelElement).not.toBeNull();
    const sideFormPanelInstance =
      sideFormPanelElement.componentInstance as SideFormPanelComponent;
    expect(sideFormPanelInstance.mainText).toBe(
      'Do you have an account already?'
    );
    expect(sideFormPanelInstance.buttonText).toBe('Log in');
    expect(sideFormPanelInstance.routerLink).toBe('/login');
  });

  it('should render BenefitsListComponent', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('app-benefits-list')).not.toBeNull();
  });
});
