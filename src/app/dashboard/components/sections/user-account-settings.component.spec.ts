import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserAccountSettingsComponent } from './user-account-settings.component';

describe('UserAccountSettingsComponent', () => {
  let component: UserAccountSettingsComponent;
  let fixture: ComponentFixture<UserAccountSettingsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UserAccountSettingsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UserAccountSettingsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
