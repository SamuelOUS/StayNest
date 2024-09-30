import { Routes } from '@angular/router';
import { HouseComponent } from './features/components/properties/default-houses/house.component';
import { CreatePropertiesComponent } from './features/components/properties/create-properties/create-properties.component';
import { ShowPropertyComponent } from './features/components/properties/show-property/show-property.component';


// Definición de las rutas
export const routes: Routes = [
    { path:'home', component: HouseComponent },
    { path:'create-properties', component: CreatePropertiesComponent },
    { path: 'show-property/:id', component: ShowPropertyComponent },
    

    // Rutas para cualquier otro path (dejar de últimas)
    { path:'', redirectTo: 'home', pathMatch: 'full'},
    { path:'**', redirectTo: 'home', pathMatch: 'full'}
];
