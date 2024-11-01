import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ProgressCircleBarComponent } from './progress-circle-bar.component';

describe('ProgressCircleBarComponent', () => {
  let component: ProgressCircleBarComponent;
  let fixture: ComponentFixture<ProgressCircleBarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProgressCircleBarComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(ProgressCircleBarComponent);
    component = fixture.componentInstance;
  });

  it('should create the component', () => {
    expect(component).toBeTruthy(); // Sprawdza, czy komponent został poprawnie utworzony.
  });

  it('should set usedSpace and totalSpace correctly', () => {
    component.usedSpace = 20; // Ustawienie używanej przestrzeni
    component.totalSpace = 100; // Ustawienie całkowitej przestrzeni

    fixture.detectChanges(); // Wykonaj detekcję zmian

    expect(component.usedSpace).toEqual(20); // Sprawdzenie używanej przestrzeni
    expect(component.totalSpace).toEqual(100); // Sprawdzenie całkowitej przestrzeni
  });

  it('should calculate fillAmount correctly', () => {
    component.usedSpace = 50; // Używana przestrzeń
    component.totalSpace = 100; // Całkowita przestrzeń

    component.ngOnChanges(); // Wywołanie metody cyklu życia

    expect(component.fillAmount.toPrecision(2)).toEqual(
      (component.circumference * 0.5).toPrecision(2)
    ); // Sprawdzenie poprawności fillAmount
  });

  it('should limit usedSpace to totalSpace', () => {
    component.usedSpace = 120; // Używana przestrzeń przekraczająca całkowitą
    component.totalSpace = 100; // Całkowita przestrzeń

    component.ngOnChanges(); // Wywołanie metody cyklu życia

    expect(component.usedSpace).toEqual(100); // Używana przestrzeń powinna być ograniczona do wartości całkowitej
    expect(component.fillAmount.toPrecision(2)).toEqual(
      component.circumference.toPrecision(2)
    ); // Fill amount powinien być równy obwodowi
  });

  it('should return correct stroke color based on usedSpace', () => {
    component.usedSpace = 50; // Używana przestrzeń
    component.totalSpace = 100; // Całkowita przestrzeń

    const strokeColor = component.getStrokeColor(); // Pobranie koloru obramowania

    expect(strokeColor).toEqual('rgb(128, 128, 0)'); // Oczekiwany kolor na podstawie obliczeń
  });

  it('should return default stroke color when usedSpace is undefined', () => {
    component.usedSpace = undefined; // Używana przestrzeń jako undefined

    const strokeColor = component.getStrokeColor(); // Pobranie koloru obramowania

    expect(strokeColor).toEqual('rgb(0, 255, 0)'); // Oczekiwany domyślny kolor
  });
});
