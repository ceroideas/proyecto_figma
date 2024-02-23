import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SimulationShapeModalComponent } from './simulation-shape-modal.component';

describe('SimulationShapeModalComponent', () => {
  let component: SimulationShapeModalComponent;
  let fixture: ComponentFixture<SimulationShapeModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SimulationShapeModalComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(SimulationShapeModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
