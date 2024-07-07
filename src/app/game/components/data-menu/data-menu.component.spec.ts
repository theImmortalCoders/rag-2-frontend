import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DataMenuComponent } from './data-menu.component';
import { ActivatedRoute, Router } from '@angular/router';
import { DataTransformService } from '../../../shared/services/data-transform.service';
import { of } from 'rxjs';

describe('DataMenuComponent', () => {
  let component: DataMenuComponent;
  let fixture: ComponentFixture<DataMenuComponent>;
  const activatedRouteMock = {
    queryParams: of({}),
  };
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DataMenuComponent],
      providers: [
        { provide: ActivatedRoute, useValue: activatedRouteMock },
        {
          provide: Router,
          useValue: {
            navigate: (): void => {
              return;
            },
          },
        },
        {
          provide: DataTransformService,
          useValue: {
            exchangeDataToCsv: (value: string): string => {
              return value;
            },
          },
        },
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DataMenuComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize with default values', () => {
    expect(component.gameName).toEqual('');
    expect(component.dataPossibleToPersist).toEqual({});
    expect(component.logData).toEqual({ menu: 'menu' });
    expect(component.dataToPersist).toEqual({});
    expect(component.collectedDataArray).toEqual([]);
    expect(component.isDataCollectingActive).toBeFalse();
  });

  it('should update dataToPersist when updateDataToPersist is called', () => {
    component.updateDataToPersist('key1', 'value1', true);
    expect(component.dataToPersist).toEqual({ key1: 'value1' });

    component.updateDataToPersist('key2', 'value2', false);
    expect(component.dataToPersist).toEqual({ key1: 'value1' });
  });

  it('should return true if key is present in dataToPersist', () => {
    component.dataToPersist = { key1: 'value1', key2: 'value2' };

    expect(component.isKeyInDataToPersist('key1')).toBeTrue();
    expect(component.isKeyInDataToPersist('key2')).toBeTrue();
    expect(component.isKeyInDataToPersist('key3')).toBeFalse();
  });
});
