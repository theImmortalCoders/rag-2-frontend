import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DataDownloadComponent } from './data-download.component';
import { GameDataSendingService } from '../../services/game-data-sending.service';
import { DataTransformService } from 'app/shared/services/data-transform.service';
import { TExchangeData } from 'app/game/models/exchange-data.type';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';
import { HttpClient, HttpHandler } from '@angular/common/http';

describe('DataDownloadComponent', () => {
  let component: DataDownloadComponent;
  let fixture: ComponentFixture<DataDownloadComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DataDownloadComponent],
      providers: [
        GameDataSendingService,
        DataTransformService,
        HttpClient,
        HttpHandler,
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DataDownloadComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should toggle vIsDataCollectingActive on button click', () => {
    const button = fixture.debugElement.query(By.css('button')).nativeElement;
    button.click();
    fixture.detectChanges();
    expect(component.vIsDataCollectingActive.value).toBe(true);
    button.click();
    fixture.detectChanges();
    expect(component.vIsDataCollectingActive.value).toBe(false);
  });

  it('should display "Start collecting data" when vIsDataCollectingActive is false', () => {
    component.vIsDataCollectingActive.value = false;
    fixture.detectChanges();
    const button = fixture.debugElement.query(By.css('button')).nativeElement;
    expect(button.textContent).toContain('Start collecting data');
  });

  it('should display "Stop collecting data" when vIsDataCollectingActive is true', () => {
    component.vIsDataCollectingActive.value = true;
    fixture.detectChanges();
    const button = fixture.debugElement.query(By.css('button')).nativeElement;
    expect(button.textContent).toContain('Stop collecting data');
  });

  it('should call deleteCollectedData on delete button click', () => {
    spyOn(component, 'deleteCollectedData');
    component.collectedDataArray = [
      {
        /* mock data */
      },
    ];
    component.vIsDataCollectingActive.value = false;
    fixture.detectChanges();
    const button = fixture.debugElement.queryAll(By.css('button'))[3]
      .nativeElement;
    button.click();
    expect(component.deleteCollectedData).toHaveBeenCalled();
  });

  it('should render download CSV button when collectedDataArray is not empty and vIsDataCollectingActive is false', () => {
    component.collectedDataArray = [
      {
        /* mock data */
      },
    ];
    component.vIsDataCollectingActive.value = false;
    fixture.detectChanges();
    const button = fixture.debugElement.queryAll(By.css('button'))[1]
      .nativeElement;
    expect(button.textContent).toContain('Download JSON');
  });

  it('should not render download CSV button when collectedDataArray is empty', () => {
    component.collectedDataArray = [];
    component.vIsDataCollectingActive.value = false;
    fixture.detectChanges();
    const button = fixture.debugElement.queryAll(By.css('button'))[1];
    expect(button).toBeUndefined();
  });
});
