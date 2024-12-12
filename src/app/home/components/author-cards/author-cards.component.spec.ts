import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { AuthorCardsComponent } from './author-cards.component';
import { authorsData } from 'app/home/models/author';
import { NgOptimizedImage } from '@angular/common';

describe('AuthorCardsComponent', () => {
  let component: AuthorCardsComponent;
  let fixture: ComponentFixture<AuthorCardsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NgOptimizedImage, AuthorCardsComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(AuthorCardsComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should hide the author card when no author is selected', () => {
    component.currentChoosenAuthor = { index: -1, githubName: '' };
    fixture.detectChanges();

    const cardElements = fixture.debugElement.queryAll(By.css('.author-card'));
    const targetCardElement = cardElements[0].nativeElement;

    const computedStyle = window.getComputedStyle(targetCardElement);

    expect(computedStyle.opacity).toBe('0');
    expect(computedStyle.right).toContain('-800px');
  });

  it('should display the correct GitHub and LinkedIn links for the selected author', () => {
    component.currentChoosenAuthor = { index: 0, githubName: 'marcinbator' };
    fixture.detectChanges();

    const githubLink = fixture.debugElement.query(
      By.css('a[href^="https://github.com/"]')
    ).nativeElement;
    const linkedinLink = fixture.debugElement.query(
      By.css('a[href^="https://linkedin.com/in/"]')
    ).nativeElement;

    expect(githubLink.getAttribute('href')).toBe(
      `https://github.com/${authorsData[0].githubName}`
    );
    expect(linkedinLink.getAttribute('href')).toBe(
      `https://linkedin.com/in/${authorsData[0].linkedinName}`
    );
  });
});
