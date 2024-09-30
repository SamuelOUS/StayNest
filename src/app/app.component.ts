import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { HeaderComponent } from './layout/components/header/header.component';
import { FooterComponent } from './layout/components/footer/footer.component';
import { HouseComponent } from './features/components/properties/default-houses/house.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, HeaderComponent, FooterComponent, HouseComponent],
  template: `
    <app-header />
    <main>
      <router-outlet />
    </main>
    <app-footer />
  `,
  styles: ``,
})
export class AppComponent {
  title = 'StayNest';
}
