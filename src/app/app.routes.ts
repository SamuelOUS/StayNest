import { Routes } from '@angular/router';
import { MyBookingsComponent } from './features/pages/my-bookings/my-bookings.component';
import { ProfileComponent } from './features/pages/profile/profile.component';
import { HelpCenterComponent } from './features/pages/help-center/help-center.component';
import { HouseComponent } from './features/components/house/house.component';
import { ShowPropertyComponent } from './features/pages/show-property/show-property.component';
import { authGuard } from './auth/guards/auth.guard';
import { ownerAuthGuard } from './auth/guards/ownerAuth.guard';
import { CreatePropertiesComponent } from './features/pages/create-properties/create-properties.component';

// Definición de las rutas
export const routes: Routes = [
    { path:'home', component: HouseComponent },
    { path:'profile', component: ProfileComponent, canActivate: [authGuard] },
    // ToDo: Create bookings component and 'myProperties' component
    { path:'my-bookings', component: MyBookingsComponent , canActivate: [authGuard] },
    // { path:'my-properties', component: , canActivate: [ownerAuthGuard] },
    { path:'create-property', component: CreatePropertiesComponent, canActivate: [ownerAuthGuard] },
    { path: 'show-property/:id', component: ShowPropertyComponent },
    { path:'help-center', component:HelpCenterComponent },
    
    // Rutas para cualquier otro path (dejar de últimas)
    { path:'', redirectTo: 'home', pathMatch: 'full'},
    { path:'**', redirectTo: 'home', pathMatch: 'full'}
];
