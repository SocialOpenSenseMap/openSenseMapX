import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ConnectRulesContainerComponent } from './connect-rules-container.component';

describe('ConnectRulesContainerComponent', () => {
  let component: ConnectRulesContainerComponent;
  let fixture: ComponentFixture<ConnectRulesContainerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ConnectRulesContainerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ConnectRulesContainerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
