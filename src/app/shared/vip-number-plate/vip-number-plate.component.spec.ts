import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VipNumberPlateComponent } from './vip-number-plate.component';

describe('VipNumberPlateComponent', () => {
  let component: VipNumberPlateComponent;
  let fixture: ComponentFixture<VipNumberPlateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [VipNumberPlateComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(VipNumberPlateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
