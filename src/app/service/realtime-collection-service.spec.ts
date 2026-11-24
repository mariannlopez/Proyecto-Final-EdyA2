import { TestBed } from '@angular/core/testing';

import { RealtimeCollectionService } from './realtime-collection-service';

describe('RealtimeCollectionService', () => {
  let service: RealtimeCollectionService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(RealtimeCollectionService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
