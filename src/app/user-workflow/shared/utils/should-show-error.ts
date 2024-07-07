import { FormGroup } from '@angular/forms';

export function shouldShowError(
  groupName: FormGroup,
  controlName: string
): boolean | undefined {
  const control = groupName.get(controlName);
  return control?.invalid && (control?.dirty || control?.touched);
}
