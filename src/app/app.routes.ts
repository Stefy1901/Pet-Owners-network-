import { Routes } from '@angular/router';
import { LoginComponent } from './components/login/login.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { ProfileComponent } from './components/profile/profile.component';
import { RegisterComponent } from './components/register/register.component';
import { LayoutComponent } from './components/layout/layout.component';
import { authGuard } from './guards/auth.guard';
import { MeetupsComponent } from './components/meetup/meetups.component';
import {SettingsComponent} from "./components/settings/settings.component";
import {PetAlertsComponent} from "./components/pet_alerts/pet-alerts.component";
import {FriendsListComponent} from "./components/friendlist/friends-list.component";

export const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },

  {
    path: '',
    component: LayoutComponent,
    children: [
      { path: 'feed', component: DashboardComponent, canActivate: [authGuard] },
      { path: 'profile', component: ProfileComponent, canActivate: [authGuard] }, // current user's profile
      { path: 'profile/:id', component: ProfileComponent, canActivate: [authGuard] }, // view other users
      { path: 'meetups', component: MeetupsComponent, canActivate: [authGuard] },
      { path: 'settings', component: SettingsComponent, canActivate: [authGuard]},
      { path: 'pet-alerts', component: PetAlertsComponent, canActivate: [authGuard] },
      { path: 'friends/:id', component: FriendsListComponent, canActivate: [authGuard] },
    ]
  }
];
