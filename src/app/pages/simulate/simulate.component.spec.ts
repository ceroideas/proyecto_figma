import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SimulateComponent } from './simulate.component';

describe('SimulateComponent', () => {
  let component: SimulateComponent;
  let fixture: ComponentFixture<SimulateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SimulateComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(SimulateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
