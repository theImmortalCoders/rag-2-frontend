import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SingleDocComponent } from './single-doc.component';
import { By } from '@angular/platform-browser';

describe('SingleDocComponent', () => {
  let component: SingleDocComponent;
  let fixture: ComponentFixture<SingleDocComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SingleDocComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(SingleDocComponent);
    component = fixture.componentInstance;
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should set buttonText correctly when file is available', async () => {
    component.header = 'Test Document';
    component.description = 'Test description';
    component.icon = 'file';
    component.fileName = 'test.pdf';
    component.isAvailable = true;

    spyOn(component, 'getFileSize').and.callFake(async () => {
      component.fileSize = '1 MB';
    });

    await component.ngOnInit();
    fixture.detectChanges();

    expect(component.buttonText).toBe('DOWNLOAD (PDF, 1 MB)');
  });

  it('should set buttonText to IN PROGRESS when file is not available', async () => {
    component.isAvailable = false;
    await component.ngOnInit();
    fixture.detectChanges();
    expect(component.buttonText).toBe('IN PROGRESS');
  });

  it('should display correct header and description', () => {
    component.header = 'Test Header';
    component.description = 'Test Description';
    fixture.detectChanges();

    const headerElement = fixture.debugElement.query(
      By.css('span.text-2xl')
    ).nativeElement;
    const descriptionElement = fixture.debugElement.query(
      By.css('span.text-justify')
    ).nativeElement;

    expect(headerElement.textContent).toContain('Test Header');
    expect(descriptionElement.textContent).toContain('Test Description');
  });

  it('should call downloadFile when button is clicked', () => {
    spyOn(component, 'downloadFile');
    component.isAvailable = true;
    fixture.detectChanges();

    const button = fixture.debugElement.query(By.css('button'));
    button.nativeElement.click();

    expect(component.downloadFile).toHaveBeenCalled();
  });

  it('should correctly determine file extension', async () => {
    component.fileName = 'document.docx';
    await component.ngOnInit();
    expect(component.fileExtension).toBe('DOCX');
  });
});
