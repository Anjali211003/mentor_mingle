import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CoacheeProfile } from './coachee-profile';

describe('CoacheeProfile', () => {
  let component: CoacheeProfile;
  let fixture: ComponentFixture<CoacheeProfile>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CoacheeProfile]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CoacheeProfile);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
