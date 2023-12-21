import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditVariableComponent } from './edit-variable.component';

describe('EditVariableComponent', () => {
  let component: EditVariableComponent;
  let fixture: ComponentFixture<EditVariableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EditVariableComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(EditVariableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
