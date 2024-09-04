import { Component } from '@angular/core';

@Component({
  selector: 'app-house',
  standalone: true,
  imports: [],
  template: `
    <section class="house-gallery">
      <ul class="house-list">
      @for (house of houses; track house.id){
        <li class="house-item">
          <img src="{{ house.img }}" alt="Casa {{ house.id }}">
          <h3>{{ house.title }}</h3>
          <p>{{ house.description }}</p>
        </li>
      }
      </ul>
    </section>
  `,
  styleUrl: `./house.component.css`
})
export class HouseComponent {
  // House data (para prueba)
  houses = [
    {
      id: 1,
      img: 'house1.jpg',
      user_id: 1,
      title: 'House 1',
      description: 'This is House 1 description',
      adress: 'street 50# 79-23',
    },
    {
      id: 2,
      img: 'house2.jpg',
      user_id: 2,
      title: 'House 2',
      description: 'This is House 2 description',
      adress: 'street 32# 12-13',
    },
    {
      id: 3,
      img: 'house3.webp',
      user_id: 3,
      title: 'House 3',
      description: 'This is House 3 description',
      adress: 'street 98# 15-22',
    },
    {
      id: 4,
      img: 'house3.webp',
      user_id: 4,
      title: 'House 4',
      description: 'This is House 4 description',
      adress: 'street 67# 32-10',
    },
    {
      id: 5,
      img: 'house3.webp',
      user_id: 5,
      title: 'House 5',
      description: 'This is House 5 description',
      adress: 'street 45# 25-18',
    }
  ]
}
