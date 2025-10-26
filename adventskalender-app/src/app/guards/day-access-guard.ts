import {CanActivateFn} from '@angular/router';

export const dayAccessGuard: CanActivateFn = (route, state) => {
  const dayId = Number(route.paramMap.get('id'));
 const today = new Date().getDate();
  return dayId > 0 && dayId <= today;

};
