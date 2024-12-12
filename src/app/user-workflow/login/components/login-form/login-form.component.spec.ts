import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { LoginFormComponent } from './login-form.component';
import { FormValidationService } from 'app/shared/services/form-validation.service';
import { By } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';

describe('LoginFormComponent', () => {
  let component: LoginFormComponent;
  let fixture: ComponentFixture<LoginFormComponent>;
  let formValidationService: FormValidationService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ReactiveFormsModule, LoginFormComponent, HttpClientModule],
      providers: [FormValidationService],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LoginFormComponent);
    component = fixture.componentInstance;
    formValidationService = TestBed.inject(FormValidationService);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have a form with 2 controls', () => {
    expect(component.loginForm.contains('email')).toBeTruthy();
    expect(component.loginForm.contains('password')).toBeTruthy();
  });

  it('should make the email control required and valid email format', () => {
    const control = component.loginForm.get('email');
    control?.setValue('');
    expect(control?.valid).toBeFalsy();

    control?.setValue('invalid-email');
    expect(control?.valid).toBeFalsy();

    control?.setValue('test@example.com');
    expect(control?.valid).toBeTruthy();
  });

  it('should make the password control required', () => {
    const control = component.loginForm.get('password');
    control?.setValue('');
    expect(control?.valid).toBeFalsy();

    control?.setValue('validpassword');
    expect(control?.valid).toBeTruthy();
  });

  it('should call submitButton method on form submit', () => {
    spyOn(component, 'submitButton');
    const form = fixture.debugElement.query(By.css('form'));
    form.triggerEventHandler('submit', null);
    expect(component.submitButton).toHaveBeenCalled();
  });

  it('should show errors when form is invalid and touched', () => {
    spyOn(formValidationService, 'getFormErrors').and.returnValue([
      'Error message',
    ]);
    component.loginForm.markAllAsTouched();
    fixture.detectChanges();
    const errorMessages = fixture.debugElement.queryAll(
      By.css('.text-red-500 p')
    );
    expect(errorMessages.length).toBe(1);
    expect(errorMessages[0].nativeElement.textContent).toContain(
      'Error message'
    );
  });

  it('should disable the submit button when form is invalid', () => {
    component.loginForm.get('email')?.setValue('');
    fixture.detectChanges();
    const button = fixture.debugElement.query(By.css('button')).nativeElement;
    expect(button.disabled).toBeTruthy();
  });

  it('should enable the submit button when form is valid', () => {
    component.loginForm.get('email')?.setValue('test@example.com');
    component.loginForm.get('password')?.setValue('validpassword');
    fixture.detectChanges();
    const button = fixture.debugElement.query(By.css('button')).nativeElement;
    expect(button.disabled).toBeFalsy();
  });
});
