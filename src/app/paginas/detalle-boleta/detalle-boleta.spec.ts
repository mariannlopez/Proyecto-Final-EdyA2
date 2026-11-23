import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DetalleBoleta } from './detalle-boleta';

describe('DetalleBoleta', () => {
  let component: DetalleBoleta;
  let fixture: ComponentFixture<DetalleBoleta>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DetalleBoleta],
    }).compileComponents();

    fixture = TestBed.createComponent(DetalleBoleta);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
