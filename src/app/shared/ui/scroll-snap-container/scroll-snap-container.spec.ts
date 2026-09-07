import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ScrollSnapContainer } from './scroll-snap-container';

describe('ScrollSnapContainer', () => {
  let component: ScrollSnapContainer;
  let fixture: ComponentFixture<ScrollSnapContainer>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ScrollSnapContainer]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ScrollSnapContainer);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
