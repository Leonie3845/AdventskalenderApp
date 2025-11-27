import {CanActivateFn} from '@angular/router';
import {isDayOpen} from "../shared/dev-date-change";


export const dayAccessGuard: CanActivateFn = (route, state) => {
  const dayId = Number(route.paramMap.get('id'));
  return isDayOpen(dayId);

};
