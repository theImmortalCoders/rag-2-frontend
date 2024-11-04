import {
  ComponentFixture,
  fakeAsync,
  TestBed,
  tick,
} from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { NavbarComponent } from './navbar.component';
import { GameListComponent } from './sections/game-list/game-list.component';
import * as feather from 'feather-icons';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { NavigationStart, Router } from '@angular/router';
import { Subscription } from 'rxjs';

describe('NavbarComponent', () => {
  let component: NavbarComponent;
  let fixture: ComponentFixture<NavbarComponent>;
  let _router: Router;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        RouterTestingModule,
        HttpClientTestingModule,
        NavbarComponent,
        GameListComponent,
      ],
      providers: [],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(NavbarComponent);
    component = fixture.componentInstance;
    _router = TestBed.inject(Router);
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
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

  it('should hide game list when navigation starts', fakeAsync(() => {
    component.isGameListActive = true;
    spyOn(_router.events, 'subscribe').and.callFake(callback => {
      if (typeof callback === 'function') {
        callback(new NavigationStart(1, '/test'));
      }
      return new Subscription();
    });

    component.ngOnInit();
    tick();
    expect(component.isGameListActive).toBeFalse();
  }));

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

  it('should set isGameListActive to false when clicking outside game-list-container', () => {
    component.isGameListActive = true;
    fixture.detectChanges();

    const mockEvent = {
      target: document.createElement('div'),
    } as unknown as MouseEvent;

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (component as any).onDocumentClick(mockEvent);

    expect(component.isGameListActive).toBeFalse();
  });

  it('should not set isGameListActive to false when clicking inside game-list-container', () => {
    component.isGameListActive = true;
    fixture.detectChanges();

    const mockElement = document.createElement('div');
    mockElement.classList.add('game-list-container');

    const mockEvent = { target: mockElement } as unknown as MouseEvent;

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (component as any).onDocumentClick(mockEvent);

    expect(component.isGameListActive).toBeTrue();
  });

  it('should call toggleGameList when game list button is clicked', () => {
    spyOn(component, 'toggleGameList');
    const button = fixture.debugElement.nativeElement.querySelector(
      '.game-list-container button'
    );
    button.click();
    expect(component.toggleGameList).toHaveBeenCalled();
  });
});
