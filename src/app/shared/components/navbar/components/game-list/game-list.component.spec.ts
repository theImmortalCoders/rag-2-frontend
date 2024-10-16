import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { GameListComponent } from './game-list.component';
import { Router } from '@angular/router';
import { By } from '@angular/platform-browser';

describe('GameListComponent', () => {
  let component: GameListComponent;
  let fixture: ComponentFixture<GameListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GameListComponent, RouterTestingModule],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(GameListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should render a list of games', () => {
    const listItems = fixture.debugElement.queryAll(By.css('ul li'));
    expect(listItems.length).toBe(component.games.length + 1); // +1 for the "Read more" item
  });

  it('should have correct router links for each game', () => {
    const listItems = fixture.debugElement.queryAll(By.css('ul li a'));
    component.games.forEach((game, index) => {
      const link = listItems[index].nativeElement as HTMLAnchorElement;
      const expectedUrl = `/game/${game.url}`;
      expect(link.getAttribute('href')).toBe(expectedUrl);
    });
  });

  it('should display the "Read more about our games..." text', () => {
    const readMoreItem = fixture.debugElement.query(By.css('ul li:last-child'));
    expect(readMoreItem.nativeElement.textContent.trim()).toBe(
      'Read more about our games...'
    );
  });

  it('should apply correct CSS classes to game items', () => {
    const gameItems = fixture.debugElement.queryAll(By.css('ul li a'));
    gameItems.forEach(item => {
      expect(item.nativeElement.classList).toContain('flex');
      expect(item.nativeElement.classList).toContain('flex-row');
      expect(item.nativeElement.classList).toContain('justify-between');
    });
  });
});
