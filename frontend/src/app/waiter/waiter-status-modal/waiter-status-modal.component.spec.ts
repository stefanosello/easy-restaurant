import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { WaiterStatusModalComponent } from './waiter-status-modal.component';

describe('WaiterStatusModalComponent', () => {
  let component: WaiterStatusModalComponent;
  let fixture: ComponentFixture<WaiterStatusModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ WaiterStatusModalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WaiterStatusModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
