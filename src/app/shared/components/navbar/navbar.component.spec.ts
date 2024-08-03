import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { NavbarComponent } from './navbar.component';
import { GameListComponent } from './game-list.component';
import * as feather from 'feather-icons';

describe('NavbarComponent', () => {
  let component: NavbarComponent;
  let fixture: ComponentFixture<NavbarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RouterTestingModule, NavbarComponent, GameListComponent],
      providers: [],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(NavbarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize isMinWidthLg based on breakpoint observer', () => {
    fixture.detectChanges();
    expect(component.isMinWidthLg).toBeFalse();
  });

  it('should toggle game list visibility when toggleGameList is called', () => {
    expect(component.isGameListActive).toBeFalse();
    component.toggleGameList();
    expect(component.isGameListActive).toBeTrue();
    component.toggleGameList();
    expect(component.isGameListActive).toBeFalse();
  });

  it('should hide game list when navigation starts', () => {
    fixture.detectChanges();
    expect(component.isGameListActive).toBeFalse();
  });

  it('should replace feather icons after view is initialized', () => {
    spyOn(feather, 'replace');
    component.ngAfterViewInit();
    expect(feather.replace).toHaveBeenCalled();
  });

  it('should unsubscribe from router and breakpoint subscriptions on destroy', () => {
    const routerSubscription = jasmine.createSpyObj('Subscription', [
      'unsubscribe',
    ]);
    const breakpointSubscription = jasmine.createSpyObj('Subscription', [
      'unsubscribe',
    ]);
    component['_routerSubscription'] = routerSubscription;
    component['_breakpointSubscription'] = breakpointSubscription;

    component.ngOnDestroy();

    expect(routerSubscription.unsubscribe).toHaveBeenCalled();
    expect(breakpointSubscription.unsubscribe).toHaveBeenCalled();
  });
});
