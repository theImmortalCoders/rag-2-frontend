import { Injectable } from '@angular/core';
import { FormGroup } from '@angular/forms';

@Injectable({
  providedIn: 'root',
})
export class FormValidationService {
  public getFormErrors(form: FormGroup): string[] {
    const errors: string[] = [];
    Object.keys(form.controls).forEach(controlName => {
      const control = form.get(controlName);
      if (control && control.errors) {
        Object.keys(control.errors).forEach(errorKey => {
          const errorMessage = this.getErrorMessage(
            controlName,
            errorKey,
            control.errors?.[errorKey]
          );
          if (errorMessage) {
            errors.push(errorMessage);
          }
        });
      }
    });
    return errors;
  }

  private getErrorMessage(
    controlName: string,
    errorKey: string,
    errorValue: unknown
  ): string | null {
    const errorMessages: Record<string, string> = {
      required: `${controlName} is required`,
      email: 'Email must be a valid email address',
      minlength: `${controlName} must be at least ${(errorValue as { requiredLength: number })?.requiredLength} characters long`,
    };
    return errorMessages[errorKey] || null;
  }
}
