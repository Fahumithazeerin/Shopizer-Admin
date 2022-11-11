import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { OptionValueImageComponent } from './option-value-image.component';

describe('OptionValueImageComponent', () => {
  let component: OptionValueImageComponent;
  let fixture: ComponentFixture<OptionValueImageComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ OptionValueImageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OptionValueImageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
