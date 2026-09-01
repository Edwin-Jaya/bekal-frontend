import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { of } from 'rxjs';
import { convertToParamMap } from '@angular/router';
import { LoanDisbursementDetail } from './loan-disbursement-detail'; // adjust to real export name

describe('LoanDisbursementDetail', () => {
  let component: LoanDisbursementDetail;
  let fixture: ComponentFixture<LoanDisbursementDetail>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LoanDisbursementDetail],
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        {
          provide: ActivatedRoute,
          useValue: {
            snapshot: {
              paramMap: {
                get: (key: string) => '1' // fake route param value
              }
            },
            paramMap: of(convertToParamMap({ id: '1' }))
          }
        }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(LoanDisbursementDetail);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});