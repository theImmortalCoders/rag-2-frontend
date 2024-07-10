import { ComponentFixture, TestBed } from '@angular/core/testing';
import { LoginPageComponent } from './login.page.component';
import { LoginFormComponent } from './components/login-form.component';
import { BenefitsListComponent } from '../shared/components/benefits-list/benefits-list.component';
import { SideFormPanelComponent } from '../shared/components/side-form-panel/side-form-panel.component';
import { RouterTestingModule } from '@angular/router/testing';
import { By } from '@angular/platform-browser';

describe('LoginPageComponent', () => {
  let component: LoginPageComponent;
  let fixture: ComponentFixture<LoginPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        RouterTestingModule,
        LoginFormComponent,
        BenefitsListComponent,
        SideFormPanelComponent,
        LoginPageComponent,
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LoginPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render LoginFormComponent', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('app-login-form')).not.toBeNull();
  });

  it('should render SideFormPanelComponent with correct inputs', () => {
    const sideFormPanelElement = fixture.debugElement.query(
      By.directive(SideFormPanelComponent)
    );
    expect(sideFormPanelElement).not.toBeNull();
    const sideFormPanelInstance =
      sideFormPanelElement.componentInstance as SideFormPanelComponent;
    expect(sideFormPanelInstance.mainText).toBe(
      "Don't you have an account yet?"
    );
    expect(sideFormPanelInstance.buttonText).toBe('Register now');
    expect(sideFormPanelInstance.routerLink).toBe('/register');
  });

  it('should render BenefitsListComponent', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('app-benefits-list')).not.toBeNull();
  });
});
