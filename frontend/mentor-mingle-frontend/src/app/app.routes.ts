import { Routes } from '@angular/router';
import { Home } from './home/home';
import { Login } from './auth/login/login';
import { Register } from './auth/register/register';
import { CoachDashboard } from './dashboard/coach-dashboard/coach-dashboard';
import { CoacheeDashboard } from './dashboard/coachee-dashboard/coachee-dashboard';
import { roleGuard } from './guards/auth.guard';
import { CreateSession } from './sessions/create-session/create-session';
import { CoachProfile } from './profile/coach-profile/coach-profile';
import { CoacheeProfile } from './profile/coachee-profile/coachee-profile';


export const routes: Routes = [
  { path: '', component: Home },   // 👈 HOME PAGE

  { path: 'login', component: Login },
  { path: 'register', component: Register },

  {
    path: 'coach-dashboard',
    component: CoachDashboard,
    canActivate: [roleGuard('coach')]
  },
  {
    path: 'coachee-dashboard',
    component: CoacheeDashboard,
    canActivate: [roleGuard('coachee')]
  },
  {
  path: 'create-session',
  component: CreateSession,
  canActivate: [roleGuard('coach')]
},
 {
    path: 'coach-profile',
    component: CoachProfile,
    canActivate: [roleGuard('coach')]
  },
  {
    path: 'coachee-profile',
    component: CoacheeProfile,
    canActivate: [roleGuard('coachee')]
  },
  

];



