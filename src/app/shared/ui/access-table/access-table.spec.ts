import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AccessTable } from './access-table';

describe('AccessTable', () => {
  let component: AccessTable;
  let fixture: ComponentFixture<AccessTable>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AccessTable]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AccessTable);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
