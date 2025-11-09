import {Routes} from '@angular/router';
import {DayComponent} from "./content/day/day.component";
import {dayAccessGuard} from "./guards/day-access-guard";
import {OnboardingComponent} from "./onboarding/onboarding.component";
import {LandingpageComponent} from "./landingpage/landingpage.component";


export const routes: Routes = [
  {
    path: 'onboarding',
    component: OnboardingComponent
  },
  {
    path: 'landingpage',
    component: LandingpageComponent,
  },
  {
    path: ':id',
    component: DayComponent,
    canActivate: [dayAccessGuard]
  },

  {
    path: '**',
    redirectTo: 'landingpage'
  },
];
