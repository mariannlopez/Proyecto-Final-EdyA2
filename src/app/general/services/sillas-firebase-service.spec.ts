import { TestBed } from '@angular/core/testing';

import { SillasFirebaseService } from './sillas-firebase-service';

describe('SillasFirebaseService', () => {
  let service: SillasFirebaseService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SillasFirebaseService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
