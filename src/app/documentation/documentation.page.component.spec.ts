import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DocumentationPageComponent } from './documentation.page.component';

describe('DocumentationComponent', () => {
  let component: DocumentationPageComponent;
  let fixture: ComponentFixture<DocumentationPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DocumentationPageComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(DocumentationPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
