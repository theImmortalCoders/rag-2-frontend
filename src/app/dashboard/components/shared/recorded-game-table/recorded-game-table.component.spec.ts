import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RecordedGameTableComponent } from './recorded-game-table.component';
import { IRecordedGameResponse } from 'app/shared/models/endpoints/recorded-game.models';
import { By } from '@angular/platform-browser';
import { TRole } from 'app/shared/models/role.enum';

describe('RecordedGameTableComponent', () => {
  let component: RecordedGameTableComponent;
  let fixture: ComponentFixture<RecordedGameTableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RecordedGameTableComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(RecordedGameTableComponent);
    component = fixture.componentInstance;
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });
});
