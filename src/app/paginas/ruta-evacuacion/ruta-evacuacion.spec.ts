import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RutaEvacuacion } from './ruta-evacuacion';

describe('RutaEvacuacion', () => {
  let component: RutaEvacuacion;
  let fixture: ComponentFixture<RutaEvacuacion>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RutaEvacuacion],
    }).compileComponents();

    fixture = TestBed.createComponent(RutaEvacuacion);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
