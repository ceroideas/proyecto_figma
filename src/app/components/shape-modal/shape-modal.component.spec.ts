import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ShapeModalComponent } from './shape-modal.component';

describe('ShapeModalComponent', () => {
  let component: ShapeModalComponent;
  let fixture: ComponentFixture<ShapeModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ShapeModalComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ShapeModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
