import {Routes} from '@angular/router';
import {DayComponent} from "./content/day/day.component";
import {dayAccessGuard} from "./guards/day-access-guard";


export const routes: Routes = [
  {
    path: 'home',
    loadComponent: () => import('./home/home.page').then((m) => m.HomePage),
  },
  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full',
  },
  {path: ':id', component: DayComponent, canActivate: [dayAccessGuard]},

];
