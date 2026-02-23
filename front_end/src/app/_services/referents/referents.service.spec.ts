import { TestBed } from '@angular/core/testing';

import { ReferentsService } from './referents.service';

describe('ReferentsService', () => {
  let service: ReferentsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ReferentsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
