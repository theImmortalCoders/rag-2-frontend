import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Error500PageComponent } from './error500.page.component';
import { NgOptimizedImage } from '@angular/common';
import { By } from '@angular/platform-browser';

describe('Error500PageComponent', () => {
  let component: Error500PageComponent;
  let fixture: ComponentFixture<Error500PageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Error500PageComponent, NgOptimizedImage],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(Error500PageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should display the correct title text', () => {
    const titleElement = fixture.debugElement.query(By.css('h1'));
    expect(titleElement.nativeElement.textContent).toContain('ERROR 500');
  });

  it('should display the correct subtitle text', () => {
    const subtitleElement = fixture.debugElement.query(By.css('h2'));
    expect(subtitleElement.nativeElement.textContent).toContain(
      'Unfortunately...'
    );
  });

  it('should display the correct body text', () => {
    const bodyTextElement = fixture.debugElement.query(By.css('span'));
    expect(bodyTextElement.nativeElement.textContent).toContain(
      'Internal server error, please try again later :('
    );
  });

  it('should display the image with the correct attributes', () => {
    const imgElement = fixture.debugElement.query(By.css('img'));
    expect(imgElement.nativeElement.src).toContain('images/rag-2.png');
    expect(imgElement.nativeElement.alt).toBe('Logo');
  });

  it('should have the correct classes applied to the main div', () => {
    const mainDivElement = fixture.debugElement.query(
      By.css('div.flex.flex-col.min-h-all')
    );
    expect(mainDivElement.nativeElement.classList).toContain('bg-mainGray');
    expect(mainDivElement.nativeElement.classList).toContain('text-mainOrange');
  });

  it('should have the correct classes applied to the container div', () => {
    const containerDivElement = fixture.debugElement.query(
      By.css('div.flex.flex-col.md\\:flex-row')
    );
    expect(containerDivElement.nativeElement.classList).toContain(
      'border-mainOrange'
    );
    expect(containerDivElement.nativeElement.classList).toContain(
      'text-mainCreme'
    );
  });
});
