import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RegisterConfirmComponent } from './register-confirm.component';
import { ActivatedRoute } from '@angular/router';
import { Router } from '@angular/router';
import { of, Subscription } from 'rxjs';
import { HttpClient, HttpHandler } from '@angular/common/http';

describe('RegisterConfirmComponent', () => {
  let component: RegisterConfirmComponent;
  let fixture: ComponentFixture<RegisterConfirmComponent>;
  let mockActivatedRoute: unknown;
  let mockRouter: unknown;

  beforeEach(async () => {
    mockActivatedRoute = {
      queryParams: of({ token: 'test-token' }),
    };

    mockRouter = {
      navigate: jasmine.createSpy('navigate'),
    };

    await TestBed.configureTestingModule({
      imports: [RegisterConfirmComponent],
      providers: [
        { provide: ActivatedRoute, useValue: mockActivatedRoute },
        HttpClient,
        HttpHandler,
        { provide: Router, useValue: mockRouter },
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RegisterConfirmComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should get token from query params and confirm account', () => {
    expect(component['_token']).toBe('test-token');
  });
});
