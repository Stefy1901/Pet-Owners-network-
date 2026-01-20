import { TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { authGuard } from './auth.guard';
import { LocalStorageService } from '../services/local-storage.service';

describe('authGuard', () => {
  let routerSpy: jasmine.SpyObj<Router>;
  let storageSpy: jasmine.SpyObj<LocalStorageService>;

  beforeEach(() => {
    routerSpy = jasmine.createSpyObj('Router', ['navigate']);
    storageSpy = jasmine.createSpyObj('LocalStorageService', ['get']);

    TestBed.configureTestingModule({
      providers: [
        { provide: Router, useValue: routerSpy },
        { provide: LocalStorageService, useValue: storageSpy }
      ]
    });
  });

  it('should allow activation if auth-key exists', () => {
    storageSpy.get.and.returnValue('token123');

    const route = {} as any; // satisfies ActivatedRouteSnapshot
    const state = {} as any; // satisfies RouterStateSnapshot
    const result = TestBed.runInInjectionContext(() => authGuard(route, state));
    expect(result).toBeTrue();
    expect(routerSpy.navigate).not.toHaveBeenCalled();
  });

  it('should block activation and redirect to /login if auth-key is missing', () => {
    storageSpy.get.and.returnValue(null);

    const route = {} as any;
    const state = {} as any;
    const result = TestBed.runInInjectionContext(() => authGuard(route, state));
    expect(result).toBeFalse();
    expect(routerSpy.navigate).toHaveBeenCalledWith(['/login']);
  });
});
