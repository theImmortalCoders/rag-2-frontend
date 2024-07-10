import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { RegisterFormComponent } from './register-form.component';
import { FormValidationService } from '../../shared/services/form-validation.service';
import { By } from '@angular/platform-browser';

describe('RegisterFormComponent', () => {
  let component: RegisterFormComponent;
  let fixture: ComponentFixture<RegisterFormComponent>;
  let formValidationService: FormValidationService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ReactiveFormsModule, RegisterFormComponent],
      providers: [FormValidationService],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RegisterFormComponent);
    component = fixture.componentInstance;
    formValidationService = TestBed.inject(FormValidationService);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have a form with 4 controls', () => {
    expect(component.registerForm.contains('name')).toBeTruthy();
    expect(component.registerForm.contains('email')).toBeTruthy();
    expect(component.registerForm.contains('password')).toBeTruthy();
    expect(component.registerForm.contains('repeatedPassword')).toBeTruthy();
  });

  it('should make the name control required', () => {
    const control = component.registerForm.get('name');
    control?.setValue('');
    expect(control?.valid).toBeFalsy();
  });

  // eslint-disable-next-line complexity
  it('should make the email control required and valid email format', () => {
    const control = component.registerForm.get('email');
    control?.setValue('');
    expect(control?.valid).toBeFalsy();

    control?.setValue('invalid-email');
    expect(control?.valid).toBeFalsy();

    control?.setValue('test@example.com');
    expect(control?.valid).toBeTruthy();
  });

  // eslint-disable-next-line complexity
  it('should make the password control required and with min length of 8', () => {
    const control = component.registerForm.get('password');
    control?.setValue('');
    expect(control?.valid).toBeFalsy();

    control?.setValue('short');
    expect(control?.valid).toBeFalsy();

    control?.setValue('longenoughpassword');
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
    component.registerForm.markAllAsTouched();
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
    component.registerForm.get('name')?.setValue('');
    fixture.detectChanges();
    const button = fixture.debugElement.query(By.css('button')).nativeElement;
    expect(button.disabled).toBeTruthy();
  });

  it('should enable the submit button when form is valid', () => {
    component.registerForm.get('name')?.setValue('Valid Name');
    component.registerForm.get('email')?.setValue('test@example.com');
    component.registerForm.get('password')?.setValue('validpassword');
    component.registerForm.get('repeatedPassword')?.setValue('validpassword');
    fixture.detectChanges();
    const button = fixture.debugElement.query(By.css('button')).nativeElement;
    expect(button.disabled).toBeFalsy();
  });
});
