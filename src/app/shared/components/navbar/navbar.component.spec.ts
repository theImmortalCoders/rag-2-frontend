import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NavbarComponent } from './navbar.component';
import { RouterTestingModule } from '@angular/router/testing';
import { By } from '@angular/platform-browser';
import * as feather from 'feather-icons';

describe('NavbarComponent', () => {
  let component: NavbarComponent;
  let fixture: ComponentFixture<NavbarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RouterTestingModule],
      declarations: [NavbarComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(NavbarComponent);
    component = fixture.componentInstance;
    spyOn(feather, 'replace');
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render the logo with a routerLink to "/"', () => {
    const logoLink = fixture.debugElement.query(By.css('a[routerLink="/"]'));
    expect(logoLink).toBeTruthy();
  });

  it('should render the "RAG-2" text', () => {
    const rag2Text = fixture.debugElement.query(By.css('span'));
    expect(rag2Text.nativeElement.textContent).toContain('RAG-2');
  });

  it('should render the users icon with a routerLink to "/login"', () => {
    const loginLink = fixture.debugElement.query(
      By.css('a[routerLink="/login"]')
    );
    expect(loginLink).toBeTruthy();
    const icon = loginLink.query(By.css('i[data-feather="users"]'));
    expect(icon).toBeTruthy();
  });

  it('should call feather.replace() after view init', () => {
    expect(feather.replace).toHaveBeenCalled();
  });
});
