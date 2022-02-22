import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BoxConnectFormContainerComponent } from './box-connect-form-container.component';

describe('BoxConnectFormContainerComponent', () => {
  let component: BoxConnectFormContainerComponent;
  let fixture: ComponentFixture<BoxConnectFormContainerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BoxConnectFormContainerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BoxConnectFormContainerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
