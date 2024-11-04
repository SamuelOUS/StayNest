import { Routes } from '@angular/router';
import { HouseComponent } from './features/components/properties/house/house.component';
import { CreatePropertiesComponent } from './features/components/properties/create-properties/create-properties.component';
import { ShowPropertyComponent } from './features/components/properties/show-property/show-property.component';

import { ProfileComponent } from './features/pages/profile/profile.component';
import { HelpCenterComponent } from './features/pages/help-center/help-center.component';

// Definición de las rutas
export const routes: Routes = [
    { path:'home', component: HouseComponent },
    { path:'profile', component: ProfileComponent },
    { path:'create-properties', component: CreatePropertiesComponent },
    { path: 'show-property/:id', component: ShowPropertyComponent },
    { path:'help_center', component:HelpCenterComponent },
    
    // Rutas para cualquier otro path (dejar de últimas)
    { path:'', redirectTo: 'home', pathMatch: 'full'},
    { path:'**', redirectTo: 'home', pathMatch: 'full'}
];
