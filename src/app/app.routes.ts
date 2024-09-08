import { Routes } from '@angular/router';
import { HouseComponent } from './features/components/house/house.component';

// Definición de las rutas
export const routes: Routes = [
    { path:'home', component: HouseComponent },

    // Rutas para cualquier otro path (dejar de últimas)
    { path:'', redirectTo: 'home', pathMatch: 'full'},
    { path:'**', redirectTo: 'home', pathMatch: 'full'},
];
