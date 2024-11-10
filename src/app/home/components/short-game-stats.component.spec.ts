/* eslint-disable @typescript-eslint/no-empty-function */
/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  ComponentFixture,
  TestBed,
  fakeAsync,
  tick,
} from '@angular/core/testing';
import { ShortGameStatsComponent } from './short-game-stats.component';
import { StatsEndpointsService } from '@endpoints/stats-endpoints.service';
import { Subscription, throwError } from 'rxjs';
import { IOverallStatsResponse } from 'app/shared/models/game.models';
import { ElementRef } from '@angular/core';
import { HttpClientTestingModule } from '@angular/common/http/testing';

describe('ShortGameStatsComponent', () => {
  let component: ShortGameStatsComponent;
  let fixture: ComponentFixture<ShortGameStatsComponent>;
  let statsEndpointsServiceMock: jasmine.SpyObj<StatsEndpointsService>;
  let elementRefMock: ElementRef;

  const mockStats: IOverallStatsResponse = {
    gamesAmount: 100,
    playersAmount: 200,
    gameRecordsAmount: 300,
    totalMemoryMb: 1.5,
    statsUpdatedDate: '',
  };

  beforeEach(async () => {
    statsEndpointsServiceMock = jasmine.createSpyObj('StatsEndpointsService', [
      'getOverallStats',
    ]);
    elementRefMock = {
      nativeElement: document.createElement('div'),
    };

    await TestBed.configureTestingModule({
      imports: [ShortGameStatsComponent, HttpClientTestingModule],
      providers: [
        { provide: StatsEndpointsService, useValue: statsEndpointsServiceMock },
        { provide: ElementRef, useValue: elementRefMock },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(ShortGameStatsComponent);
    component = fixture.componentInstance;
  });

  afterEach(() => {
    fixture.destroy();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  describe('ngOnInit', () => {
    it('should initialize IntersectionObserver and observe the element', () => {
      component.ngOnInit();
      expect(component['_observer']).toBeTruthy();
      component['_observer']?.observe(elementRefMock.nativeElement);
    });
  });

  describe('IntersectionObserver', () => {
    let observeSpy: jasmine.Spy;
    let _disconnectSpy: jasmine.Spy;

    beforeEach(() => {
      observeSpy = spyOn<any>(
        window.IntersectionObserver.prototype,
        'observe'
      ).and.callFake(() => {});
      _disconnectSpy = spyOn<any>(
        window.IntersectionObserver.prototype,
        'disconnect'
      ).and.callFake(() => {});

      component.ngOnInit();
    });

    it('should initialize IntersectionObserver and observe the element', () => {
      expect(observeSpy).toHaveBeenCalled();
    });

    it('should handle error if API call fails', () => {
      statsEndpointsServiceMock.getOverallStats.and.returnValue(
        throwError(() => new Error('API error'))
      );

      component['callAnimation']();

      expect(component.overallStats).toBeNull();
    });
  });

  describe('callAnimation', () => {
    it('should call animateStats for each property', () => {
      component.overallStats = mockStats;
      const animateSpy = spyOn<any>(component, 'animateStats');

      component['callAnimation']();

      expect(animateSpy).toHaveBeenCalledWith(
        'displayTotalGames',
        mockStats.gamesAmount
      );
      expect(animateSpy).toHaveBeenCalledWith(
        'displayTotalPlayers',
        mockStats.playersAmount
      );
      expect(animateSpy).toHaveBeenCalledWith(
        'displayTotalPlays',
        mockStats.gameRecordsAmount
      );
      expect(animateSpy).toHaveBeenCalledWith(
        'displayTotalStorage',
        mockStats.totalMemoryMb.toPrecision(2)
      );
    });
  });

  describe('animateStats', () => {
    it('should animate stat to final value', fakeAsync(() => {
      const finalValue = 100;
      component['animateStats']('displayTotalGames', finalValue);

      tick(1000);

      expect(component.displayTotalGames).toBe(finalValue);
    }));
  });

  describe('ngOnDestroy', () => {
    it('should unsubscribe from all subscriptions and clear intervals', () => {
      component['_getOverallStatsSubscription'] = new Subscription();
      spyOn(component['_getOverallStatsSubscription'], 'unsubscribe');

      const clearIntervalSpy = spyOn(window, 'clearInterval');

      component['_intervalIds'] = {
        displayTotalGames: setInterval(() => {}, 100),
        displayTotalPlayers: setInterval(() => {}, 100),
      };

      component.ngOnDestroy();

      expect(
        component['_getOverallStatsSubscription'].unsubscribe
      ).toHaveBeenCalled();
      expect(clearIntervalSpy).toHaveBeenCalledTimes(2);
    });
  });
});
