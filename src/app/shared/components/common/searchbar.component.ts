import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-searchbar',
  standalone: true,
  imports: [FormsModule],
  template: `
    <div>
      <input
        type="text"
        id="searchbar"
        class="custom-input"
        [(ngModel)]="searchQuery"
        (input)="onSearch()"
        placeholder="Search..." />
    </div>
  `,
})
export class SearchbarComponent<T> {
  @Input() public data: T[] = [];
  @Input() public searchField: keyof T | null = null;

  @Output() public filteredData = new EventEmitter<T[]>();

  public searchQuery = '';

  public onSearch(): void {
    if (!this.searchField) return;

    const filtered = this.data.filter(item => {
      const value = item[this.searchField as keyof T];
      return (
        value &&
        value.toString().toLowerCase().includes(this.searchQuery.toLowerCase())
      );
    });

    this.filteredData.emit(filtered);

    if (!this.searchQuery || this.searchQuery === '') {
      this.filteredData.emit([]);
    }
  }
}
