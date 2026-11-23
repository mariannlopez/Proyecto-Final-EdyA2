import { TestBed } from '@angular/core/testing';

import { Boletas } from './boletas';

describe('Boletas', () => {
  let service: Boletas;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(Boletas);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
