import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { HeaderComponent } from './header/header.component';
import { FooterComponent } from './footer/footer.component';
import { HouseComponent } from './house/house.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, HeaderComponent, FooterComponent, HouseComponent],
  template: `
    <app-header />
    <main>
      <app-house/>
    </main>
    <app-footer />

    <router-outlet />
  `,
  styles: ``,
})
export class AppComponent {
  title = 'StayNest';
}
