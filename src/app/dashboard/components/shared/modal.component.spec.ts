import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ModalComponent } from './modal.component';
import { By } from '@angular/platform-browser';
import { EventEmitter } from '@angular/core';

describe('ModalComponent', () => {
  let component: ModalComponent;
  let fixture: ComponentFixture<ModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ModalComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(ModalComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should emit closeModal event when backdrop is clicked', () => {
    spyOn(component.closeModal, 'emit');

    const backdrop = fixture.debugElement.query(By.css('button.fixed'));
    backdrop.nativeElement.click();

    expect(component.closeModal.emit).toHaveBeenCalled();
  });

  it('should not emit closeModal event when dialog button is clicked', () => {
    spyOn(component.closeModal, 'emit');

    const dialogButton = fixture.debugElement.query(
      By.css('button[role="dialog"]')
    );
    dialogButton.nativeElement.click();

    expect(component.closeModal.emit).not.toHaveBeenCalled();
  });

  it('should render content projected into the modal', () => {
    const content = 'Test content';

    // Ustawienie komponentu z treścią
    fixture = TestBed.createComponent(ModalComponent);
    component = fixture.componentInstance;

    fixture.detectChanges();

    const modalContent = document.createElement('div');
    modalContent.innerHTML = content;
    fixture.nativeElement.appendChild(modalContent);

    fixture.detectChanges();

    expect(fixture.nativeElement.textContent).toContain(content);
  });
});
