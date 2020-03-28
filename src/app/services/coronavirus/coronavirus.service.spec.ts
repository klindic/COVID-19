import { TestBed } from '@angular/core/testing';

import { CoronavirusService } from './coronavirus.service';

describe('CoronavirusService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: CoronavirusService = TestBed.get(CoronavirusService);
    expect(service).toBeTruthy();
  });
});
