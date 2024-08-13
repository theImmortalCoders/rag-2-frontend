import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AuthorCardsComponent } from './author-cards.component';

describe('AuthorCardsComponent', () => {
  let component: AuthorCardsComponent;
  let fixture: ComponentFixture<AuthorCardsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AuthorCardsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AuthorCardsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
