import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DataMenuComponent } from './data-menu.component';
import { By } from '@angular/platform-browser';

describe('DataMenuComponent', () => {
  let component: DataMenuComponent;
  let fixture: ComponentFixture<DataMenuComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DataMenuComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DataMenuComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should update data to persist on checkbox change', () => {
    const testKey = 'testKey';
    const testValue = 'testValue';
    component.dataPossibleToPersist = { [testKey]: testValue };
    component.updateDataToPersist(testKey, testValue, true);
  });
});
