import { TestBed } from '@angular/core/testing';

import { GeoCodingService } from './geo-coding.service';

describe('GeoCodingService', () => {
  let service: GeoCodingService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(GeoCodingService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
