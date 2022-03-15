import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProfileConnectedRulesComponent } from './profile-connected-rules.component';

describe('ProfileConnectedRulesComponent', () => {
  let component: ProfileConnectedRulesComponent;
  let fixture: ComponentFixture<ProfileConnectedRulesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProfileConnectedRulesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProfileConnectedRulesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
