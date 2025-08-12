import { Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { LoginComponent } from './login/login.component';
import { authGuard, loginGuard } from '@guards/auth.guard';

export const routes: Routes = [
  { path: 'login', component: LoginComponent, canActivate: [loginGuard] },
  { path: '', component: HomeComponent, canActivate: [authGuard] },
  // { path: '', component: HomeComponent },
  { path: '**', redirectTo: '' },
];
