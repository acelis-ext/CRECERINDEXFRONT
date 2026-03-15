import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Searchmassive } from './searchmassive';

describe('Searchmassive', () => {
  let component: Searchmassive;
  let fixture: ComponentFixture<Searchmassive>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Searchmassive]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Searchmassive);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
