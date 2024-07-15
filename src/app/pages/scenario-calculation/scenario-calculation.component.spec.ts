import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ScenarioCalculationComponent } from './scenario-calculation.component';

describe('ScenarioCalculationComponent', () => {
  let component: ScenarioCalculationComponent;
  let fixture: ComponentFixture<ScenarioCalculationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ScenarioCalculationComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ScenarioCalculationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
