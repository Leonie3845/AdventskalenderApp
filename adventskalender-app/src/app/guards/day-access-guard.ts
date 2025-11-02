import {CanActivateFn} from '@angular/router';
import {getDateToday} from "../shared/dev-date-change";



export const dayAccessGuard: CanActivateFn = (route, state) => {
  const dayId = Number(route.paramMap.get('id'));
  const today = getDateToday();
  return dayId > 0 && dayId <= today;

};
