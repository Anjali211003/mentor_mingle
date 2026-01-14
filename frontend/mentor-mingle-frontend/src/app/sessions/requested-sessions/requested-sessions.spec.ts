import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RequestedSessions } from './requested-sessions';

describe('RequestedSessions', () => {
  let component: RequestedSessions;
  let fixture: ComponentFixture<RequestedSessions>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RequestedSessions]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RequestedSessions);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
