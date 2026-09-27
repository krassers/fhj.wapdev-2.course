import { provideHttpClientTesting } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { EmployeeDetail } from './employee-detail';

describe('EmployeeDetail', () => {
  let component: EmployeeDetail;
  let fixture: ComponentFixture<EmployeeDetail>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EmployeeDetail],
      providers: [provideHttpClientTesting(), provideRouter([])],
    }).compileComponents();

    fixture = TestBed.createComponent(EmployeeDetail);
    fixture.componentRef.setInput('id', '1');
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
