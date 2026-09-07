import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProcessSteps } from './process-steps';

describe('ProcessSteps', () => {
  let component: ProcessSteps;
  let fixture: ComponentFixture<ProcessSteps>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProcessSteps]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProcessSteps);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
