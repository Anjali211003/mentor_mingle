import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CoacheeDashboard } from './coachee-dashboard';

describe('CoacheeDashboard', () => {
  let component: CoacheeDashboard;
  let fixture: ComponentFixture<CoacheeDashboard>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CoacheeDashboard]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CoacheeDashboard);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
