import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SeleccionSillas } from './seleccion-sillas';

describe('SeleccionSillas', () => {
  let component: SeleccionSillas;
  let fixture: ComponentFixture<SeleccionSillas>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SeleccionSillas],
    }).compileComponents();

    fixture = TestBed.createComponent(SeleccionSillas);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
