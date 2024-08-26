import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { SocketDomainInputComponent } from './socket-domain-input.component';

describe('SocketDomainInputComponent', () => {
  let component: SocketDomainInputComponent;
  let fixture: ComponentFixture<SocketDomainInputComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SocketDomainInputComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(SocketDomainInputComponent);
    component = fixture.componentInstance;
    component.recentPhrases = ['example.com', 'localhost'];
    fixture.detectChanges();
  });

  it('should emit value on input change', () => {
    spyOn(component.socketDomainEmitter, 'emit');
    const inputElement = fixture.debugElement.query(
      By.css('input')
    ).nativeElement;
    inputElement.value = 'example.com';
    inputElement.dispatchEvent(new Event('change'));
    expect(component.socketDomainEmitter.emit).toHaveBeenCalledWith(
      'example.com'
    );
  });

  it('should list all recent phrases as options', () => {
    const options = fixture.debugElement.queryAll(By.css('datalist option'));
    expect(options.length).toBe(component.recentPhrases.length);
    options.forEach((option, index) => {
      expect(option.nativeElement.value).toBe(component.recentPhrases[index]);
    });
  });
});
