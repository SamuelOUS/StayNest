import { Component, EventEmitter, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-search-bar',
  standalone: true,
  imports: [FormsModule ],
  templateUrl: './search-bar.component.html',
  styleUrl: './search-bar.component.css'
})
export class SearchBarComponent {
  searchTerm: string = '';
  searchCapacity: number | undefined;
  @Output() search = new EventEmitter<{ search: string; capacity: number | undefined }>();

  onSearch() {
      this.search.emit({ search: this.searchTerm, capacity: this.searchCapacity });
  }
}
