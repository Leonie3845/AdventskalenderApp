import { TestBed } from '@angular/core/testing';
import { CanActivateFn } from '@angular/router';

import { dayAccessGuard } from './day-access-guard';

describe('dayAccessGuard', () => {
  const executeGuard: CanActivateFn = (...guardParameters) => 
      TestBed.runInInjectionContext(() => dayAccessGuard(...guardParameters));

  beforeEach(() => {
    TestBed.configureTestingModule({});
  });

  it('should be created', () => {
    expect(executeGuard).toBeTruthy();
  });
});
