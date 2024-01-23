import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UniteModalComponent } from './unite-modal.component';

describe('UniteModalComponent', () => {
  let component: UniteModalComponent;
  let fixture: ComponentFixture<UniteModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UniteModalComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(UniteModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
