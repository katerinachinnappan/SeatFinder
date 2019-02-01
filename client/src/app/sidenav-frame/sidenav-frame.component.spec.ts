import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SidenavFrameComponent } from './sidenav-frame.component';

describe('SidenavFrameComponent', () => {
  let component: SidenavFrameComponent;
  let fixture: ComponentFixture<SidenavFrameComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SidenavFrameComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SidenavFrameComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
