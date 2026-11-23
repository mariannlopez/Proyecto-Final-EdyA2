import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Auntenticacion } from './auntenticacion';

describe('Auntenticacion', () => {
  let component: Auntenticacion;
  let fixture: ComponentFixture<Auntenticacion>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Auntenticacion],
    }).compileComponents();

    fixture = TestBed.createComponent(Auntenticacion);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
