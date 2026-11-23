import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExitoCompra } from './exito-compra';

describe('ExitoCompra', () => {
  let component: ExitoCompra;
  let fixture: ComponentFixture<ExitoCompra>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ExitoCompra],
    }).compileComponents();

    fixture = TestBed.createComponent(ExitoCompra);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
