import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GameMenuComponent } from './game-menu.component';
import { TGameDataSendingType } from '../../models/game-data-sending-type.enum';

describe('TimeMenuComponent', () => {
  let component: GameMenuComponent;
  let fixture: ComponentFixture<GameMenuComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GameMenuComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(GameMenuComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have default socket domain', () => {
    expect(component.defaultSocketDomain).toBeDefined();
  });

  it('should call onInputChange with correct parameters on input change', () => {
    spyOn(component, 'onInputChange');
    const inputElement =
      fixture.nativeElement.querySelector('#socketDomainInput');
    inputElement.value = 'newDomain.com';
    inputElement.dispatchEvent(new Event('input'));
    fixture.detectChanges();
    expect(component.onInputChange).toHaveBeenCalledWith(
      'socketDomain',
      'newDomain.com'
    );
  });

  it('should call onInputChange with correct parameters on button click', () => {
    spyOn(component, 'onInputChange');
    const buttonElement = fixture.nativeElement.querySelector('button');
    buttonElement.click();
    fixture.detectChanges();
    expect(component.onInputChange).toHaveBeenCalledWith(
      'applySocketDomain',
      'yes',
      true
    );
  });
});
