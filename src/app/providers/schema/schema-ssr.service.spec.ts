import { TestBed } from '@angular/core/testing';

import { SchemaSsrService } from './schema-ssr.service';

describe('SchemaSsrService', () => {
  let service: SchemaSsrService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SchemaSsrService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
