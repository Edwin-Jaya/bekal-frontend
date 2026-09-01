import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute, convertToParamMap } from '@angular/router';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { of } from 'rxjs';

import { LoanApprovalDetail } from './loan-approval-detail';

describe('LoanApprovalDetail', () => {
  let component: LoanApprovalDetail;
  let fixture: ComponentFixture<LoanApprovalDetail>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LoanApprovalDetail],
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        {
          provide: ActivatedRoute,
          useValue: {
            snapshot: {
              paramMap: {
                get: (key: string) => '1'
              }
            },
            paramMap: of(convertToParamMap({ id: '1' }))
          }
        }
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LoanApprovalDetail);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});