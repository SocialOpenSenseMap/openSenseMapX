import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BoxConnectFormComponent } from './box-connect-form.component';

describe('BoxConnectFormComponent', () => {
  let component: BoxConnectFormComponent;
  let fixture: ComponentFixture<BoxConnectFormComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BoxConnectFormComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BoxConnectFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
