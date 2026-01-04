import { TestBed } from '@angular/core/testing';

import { CoacheeSession } from './coachee-session';

describe('CoacheeSession', () => {
  let service: CoacheeSession;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CoacheeSession);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
