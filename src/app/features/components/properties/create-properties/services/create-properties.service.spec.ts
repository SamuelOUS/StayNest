import { TestBed } from '@angular/core/testing';

import { CreatePropertiesService } from './create-properties.service';

describe('CreatePropertiesService', () => {
  let service: CreatePropertiesService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CreatePropertiesService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
