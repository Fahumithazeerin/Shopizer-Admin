import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SellerDetailEditComponent } from './seller-detail-edit.component';

describe('SellerDetailEditComponent', () => {
  let component: SellerDetailEditComponent;
  let fixture: ComponentFixture<SellerDetailEditComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SellerDetailEditComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SellerDetailEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
