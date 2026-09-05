import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MorphingObject } from './morphing-object';

describe('MorphingObject', () => {
  let component: MorphingObject;
  let fixture: ComponentFixture<MorphingObject>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MorphingObject]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MorphingObject);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
