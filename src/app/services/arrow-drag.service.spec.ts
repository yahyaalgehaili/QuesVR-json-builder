import { TestBed } from '@angular/core/testing';

import { ArrowDragService } from './arrow-drag.service';

describe('ArrowDragService', () => {
  let service: ArrowDragService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ArrowDragService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
