/* eslint-disable @typescript-eslint/no-explicit-any */
import { TestBed, ComponentFixture } from '@angular/core/testing';
import { UserDetailsComponent } from './user-details.component';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';
import { GameEndpointsService } from '@endpoints/game-endpoints.service';
import { GameRecordEndpointsService } from '@endpoints/game-record-endpoints.service';
import { AdministrationEndpointsService } from '@endpoints/administration-endpoints.service';
import { StatsEndpointsService } from '@endpoints/stats-endpoints.service';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';

describe('UserDetailsComponent', () => {
  let component: UserDetailsComponent;
  let fixture: ComponentFixture<UserDetailsComponent>;

  let mockActivatedRoute: any;
  let mockGameEndpointsService: any;
  let mockGameRecordEndpointsService: any;
  let mockAdminEndpointsService: any;
  let mockStatsEndpointsService: any;

  beforeEach(async () => {
    mockActivatedRoute = {
      params: of({ id: 1 }),
    };

    mockGameEndpointsService = {
      getGames: jasmine
        .createSpy('getGames')
        .and.returnValue(of([{ id: 1, name: 'Game 1' }])),
    };

    mockGameRecordEndpointsService = {
      getAllRecordedGames: jasmine
        .createSpy('getAllRecordedGames')
        .and.returnValue(of([{ id: 1, name: 'Recorded Game 1' }])),
      downloadSpecificRecordedGame: jasmine
        .createSpy('downloadSpecificRecordedGame')
        .and.returnValue(of(null)),
      deleteGameRecording: jasmine
        .createSpy('deleteGameRecording')
        .and.returnValue(of(null)),
    };

    mockAdminEndpointsService = {
      getUserDetails: jasmine
        .createSpy('getUserDetails')
        .and.returnValue(of({ id: 1, email: 'test@example.com' })),
    };

    mockStatsEndpointsService = {
      getUserStats: jasmine
        .createSpy('getUserStats')
        .and.returnValue(of({ totalStorageMb: 100 })),
    };

    await TestBed.configureTestingModule({
      imports: [
        UserDetailsComponent,
        HttpClientTestingModule,
        RouterTestingModule,
      ],
      providers: [
        { provide: ActivatedRoute, useValue: mockActivatedRoute },
        { provide: GameEndpointsService, useValue: mockGameEndpointsService },
        {
          provide: GameRecordEndpointsService,
          useValue: mockGameRecordEndpointsService,
        },
        {
          provide: AdministrationEndpointsService,
          useValue: mockAdminEndpointsService,
        },
        { provide: StatsEndpointsService, useValue: mockStatsEndpointsService },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(UserDetailsComponent);
    component = fixture.componentInstance;
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize user details on ngOnInit', () => {
    component.ngOnInit();

    expect(mockAdminEndpointsService.getUserDetails).toHaveBeenCalledWith(1);
  });

  it('should fetch games and recorded games on ngOnInit', () => {
    component.ngOnInit();

    expect(mockGameEndpointsService.getGames).toHaveBeenCalled();
    expect(
      mockGameRecordEndpointsService.getAllRecordedGames
    ).toHaveBeenCalledWith(1, 1);
  });

  it('should download a game record', () => {
    component.downloadGameRecord(1);

    expect(
      mockGameRecordEndpointsService.downloadSpecificRecordedGame
    ).toHaveBeenCalledWith(1);
  });

  it('should delete a game record and refresh the list', () => {
    spyOn(component, 'getRecordedGames');

    component.deleteGameRecord(1);

    expect(
      mockGameRecordEndpointsService.deleteGameRecording
    ).toHaveBeenCalledWith(1);
    expect(component.getRecordedGames).toHaveBeenCalled();
  });

  it('should unsubscribe from all subscriptions on destroy', () => {
    const unsubscribeSpy = spyOn(
      component['_getGamesSubscription'],
      'unsubscribe'
    ).and.callThrough();

    component.ngOnDestroy();

    expect(unsubscribeSpy).toHaveBeenCalled();
  });
});
