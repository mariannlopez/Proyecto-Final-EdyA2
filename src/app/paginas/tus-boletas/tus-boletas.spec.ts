import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TusBoletas } from './tus-boletas';

describe('TusBoletas', () => {
  let component: TusBoletas;
  let fixture: ComponentFixture<TusBoletas>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TusBoletas],
    }).compileComponents();

    fixture = TestBed.createComponent(TusBoletas);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
