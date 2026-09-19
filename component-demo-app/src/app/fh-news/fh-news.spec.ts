import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FhNews } from './fh-news';

describe('FhNews', () => {
  let component: FhNews;
  let fixture: ComponentFixture<FhNews>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FhNews],
    }).compileComponents();

    fixture = TestBed.createComponent(FhNews);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
