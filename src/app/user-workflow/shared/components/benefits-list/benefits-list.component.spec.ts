import { ComponentFixture, TestBed } from '@angular/core/testing';
import { BenefitsListComponent } from './benefits-list.component';
import * as feather from 'feather-icons';

describe('BenefitsListComponent', () => {
  let component: BenefitsListComponent;
  let fixture: ComponentFixture<BenefitsListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BenefitsListComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BenefitsListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render the title', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('h1')?.textContent).toContain(
      'Why is it worth to have an account on RAG-2?'
    );
  });

  it('should render the benefits list', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    const items = compiled.querySelectorAll('span');
    expect(items.length).toBe(4);
    expect(items[0].textContent).toContain('Save your games');
    expect(items[1].textContent).toContain('Keep everything together');
    expect(items[2].textContent).toContain("Watch log's console view");
    expect(items[3].textContent).toContain('Track your progress');
  });

  it('should call feather.replace on ngAfterViewInit', () => {
    spyOn(feather, 'replace');
    component.ngAfterViewInit();
    expect(feather.replace).toHaveBeenCalled();
  });
});
