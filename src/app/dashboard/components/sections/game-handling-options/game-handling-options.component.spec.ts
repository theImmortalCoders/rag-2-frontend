import {
  ComponentFixture,
  TestBed,
  fakeAsync,
  tick,
} from '@angular/core/testing';
import { GameHandlingOptionsComponent } from './game-handling-options.component';
import { GameEndpointsService } from '@endpoints/game-endpoints.service';
import { NotificationService } from 'app/shared/services/notification.service';
import { ReactiveFormsModule } from '@angular/forms';
import { of } from 'rxjs';
import { IGameResponse } from '@api-models/game.models';
import { HttpClientTestingModule } from '@angular/common/http/testing';

describe('GameHandlingOptionsComponent', () => {
  let component: GameHandlingOptionsComponent;
  let fixture: ComponentFixture<GameHandlingOptionsComponent>;
  let mockGameEndpointsService: jasmine.SpyObj<GameEndpointsService>;
  let mockNotificationService: jasmine.SpyObj<NotificationService>;

  beforeEach(async () => {
    mockGameEndpointsService = jasmine.createSpyObj('GameEndpointsService', [
      'getGames',
      'addGame',
      'updateGame',
      'deleteGame',
    ]);
    mockNotificationService = jasmine.createSpyObj('NotificationService', [
      'addNotification',
    ]);

    await TestBed.configureTestingModule({
      imports: [
        GameHandlingOptionsComponent,
        ReactiveFormsModule,
        HttpClientTestingModule,
      ],
      providers: [
        { provide: GameEndpointsService, useValue: mockGameEndpointsService },
        { provide: NotificationService, useValue: mockNotificationService },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(GameHandlingOptionsComponent);
    component = fixture.componentInstance;
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize form controls correctly', () => {
    expect(component.gameHandlingForm).toBeDefined();
    expect(component.gameHandlingForm.controls.newGameName).toBeDefined();
    expect(component.gameHandlingForm.controls.editedGameName).toBeDefined();
    expect(component.gameHandlingForm.controls.newGameName.valid).toBeFalse();
    expect(
      component.gameHandlingForm.controls.editedGameName.valid
    ).toBeFalse();
  });

  it('should open the add new game modal', () => {
    component.addNewGameModal();
    expect(component.modalVisibility).toBe('addNewGame');
    expect(component.modalTitle).toBe('Adding new game');
    expect(component.modalButtonText).toBe('Add new game');
    expect(component.gameHandlingForm.value.newGameName).toBe('');
  });

  it('should open the edit game modal and fetch games', fakeAsync(() => {
    const mockGames: IGameResponse[] = [
      { id: 1, name: 'Game 1', description: 'ee' },
      { id: 2, name: 'Game 2', description: 'bb' },
    ];
    mockGameEndpointsService.getGames.and.returnValue(of(mockGames));

    component.editGameModal();
    tick(); // Process async tasks

    expect(component.modalVisibility).toBe('editGame');
    expect(component.modalTitle).toBe('Editing existing game');
    expect(component.gameList).toEqual(mockGames);
  }));

  it('should add a new game and show notification', fakeAsync(() => {
    component.modalVisibility = 'addNewGame';
    component.gameHandlingForm.controls.newGameName.setValue('New Game');

    mockGameEndpointsService.addGame.and.returnValue(of());
    component.addNewGameFunction();
    tick();

    expect(component.modalVisibility).toBe('addNewGame');
    expect(component.errorMessage).toBeNull();
  }));

  it('should edit an existing game and show notification', fakeAsync(() => {
    component.modalVisibility = 'editGame';
    component.selectedGameId = 1;
    component.gameHandlingForm.controls.editedGameName.setValue('Edited Game');

    mockGameEndpointsService.updateGame.and.returnValue(of());
    component.editGameFunction();
    tick();

    expect(component.modalVisibility).toBe('editGame');
    expect(component.errorMessage).toBeNull();
  }));

  it('should remove a game and show notification', fakeAsync(() => {
    component.modalVisibility = 'removeGame';
    component.selectedGameId = 1;

    mockGameEndpointsService.deleteGame.and.returnValue(of());
    component.removeGameFunction();
    tick();

    expect(component.modalVisibility).toBe('removeGame');
    expect(component.errorMessage).toBeNull();
  }));

  it('should clear subscriptions on destroy', () => {
    component.ngOnDestroy();
    expect(mockGameEndpointsService.getGames.calls.any()).toBeFalse();
    expect(mockGameEndpointsService.addGame.calls.any()).toBeFalse();
    expect(mockGameEndpointsService.updateGame.calls.any()).toBeFalse();
    expect(mockGameEndpointsService.deleteGame.calls.any()).toBeFalse();
  });
});
