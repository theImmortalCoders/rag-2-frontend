import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HomePageComponent } from './home.page.component';
import { By } from '@angular/platform-browser';
import feather from 'feather-icons';
import { NgOptimizedImage } from '@angular/common';
import { AuthorCardsComponent } from './components/author-cards.component';

describe('HomePageComponent', () => {
  let component: HomePageComponent;
  let fixture: ComponentFixture<HomePageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NgOptimizedImage, AuthorCardsComponent, HomePageComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(HomePageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should have initial currentChoosenAuthor as index -1 and empty githubName', () => {
    expect(component.currentChoosenAuthor).toEqual({
      index: -1,
      githubName: '',
    });
  });

  it('should update currentChoosenAuthor when chooseAuthor is called', () => {
    component.chooseAuthor(0, 'testGithubName');
    expect(component.currentChoosenAuthor).toEqual({
      index: 0,
      githubName: 'testGithubName',
    });

    component.chooseAuthor(0, 'testGithubName');
    expect(component.currentChoosenAuthor).toEqual({
      index: -1,
      githubName: 'testGithubName',
    });
  });

  it('should call feather.replace() in ngAfterViewInit and ngAfterViewChecked', () => {
    const featherReplaceSpy = spyOn(feather, 'replace');

    component.ngAfterViewInit();
    expect(featherReplaceSpy).toHaveBeenCalled();

    component.ngAfterViewChecked();
    expect(featherReplaceSpy).toHaveBeenCalledTimes(2);
  });

  it('should pass currentChoosenAuthor to AuthorCardsComponent', () => {
    const authorCardsComponent = fixture.debugElement.query(
      By.directive(AuthorCardsComponent)
    ).componentInstance;
    expect(authorCardsComponent.currentChoosenAuthor).toEqual(
      component.currentChoosenAuthor
    );
  });
});
