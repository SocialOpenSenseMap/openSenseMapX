import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ConnectRulesComponent } from './connect-rules.component';

describe('ConnectRulesComponent', () => {
  let component: ConnectRulesComponent;
  let fixture: ComponentFixture<ConnectRulesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ConnectRulesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ConnectRulesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
