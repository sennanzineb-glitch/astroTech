import { TestBed } from '@angular/core/testing';

import { AffairesService } from './affaires.service';

describe('AffairesService', () => {
  let service: AffairesService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AffairesService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
