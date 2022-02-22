import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BoxConnectBtnComponent } from './box-connect-btn.component';

describe('BoxConnectBtnComponent', () => {
  let component: BoxConnectBtnComponent;
  let fixture: ComponentFixture<BoxConnectBtnComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BoxConnectBtnComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BoxConnectBtnComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
