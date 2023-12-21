import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SetPriceComponent } from './set-price.component';

describe('SetPriceComponent', () => {
  let component: SetPriceComponent;
  let fixture: ComponentFixture<SetPriceComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SetPriceComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(SetPriceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
