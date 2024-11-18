import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-star',
  standalone: true,
  imports: [CommonModule],
  template: `
    <span *ngFor="let star of [].constructor(maxStars); let i = index">
      <i class="fa" [ngClass]="{'fa-star': i < rating, 'fa-star-o': i >= rating}"></i>
    </span>
  `,
  styles: `
    .fa-star {
      color: gold;
    }

    .fa-star-o {
      color: lightgray;
    }
  `
})
export class StarComponent {
  @Input() rating: number = 0; 
  maxStars: number = 5;
}
