import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { HTTP_INTERCEPTORS, HttpClient } from '@angular/common/http';
import { AuthKeyInterceptor } from './auth-key.interceptor';
import { LocalStorageService } from '../services/local-storage.service';

describe('AuthKeyInterceptor', () => {
  let httpMock: HttpTestingController;
  let httpClient: HttpClient;
  let storageServiceSpy: jasmine.SpyObj<LocalStorageService>;

  beforeEach(() => {
    const spy = jasmine.createSpyObj('LocalStorageService', ['get']);

    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        { provide: LocalStorageService, useValue: spy },
        {
          provide: HTTP_INTERCEPTORS,
          useClass: AuthKeyInterceptor,
          multi: true
        }
      ]
    });

    httpMock = TestBed.inject(HttpTestingController);
    httpClient = TestBed.inject(HttpClient);
    storageServiceSpy = TestBed.inject(LocalStorageService) as jasmine.SpyObj<LocalStorageService>;
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should add Authorization header if token exists', () => {
    const testToken = '12345';
    storageServiceSpy.get.and.returnValue(testToken);

    httpClient.get('/test').subscribe();

    const req = httpMock.expectOne('/test');
    expect(req.request.headers.has('Authorization')).toBeTrue();
    expect(req.request.headers.get('Authorization')).toBe(`Bearer ${testToken}`);
    req.flush({});
  });

  it('should not add Authorization header if no token', () => {
    storageServiceSpy.get.and.returnValue(null);

    httpClient.get('/test').subscribe();

    const req = httpMock.expectOne('/test');
    expect(req.request.headers.has('Authorization')).toBeFalse();
    req.flush({});
  });
});
