import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProcessStepsComponent } from './process-steps';

describe('ProcessStepsComponent', () => {
  let component: ProcessStepsComponent;
  let fixture: ComponentFixture<ProcessStepsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProcessStepsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProcessStepsComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

