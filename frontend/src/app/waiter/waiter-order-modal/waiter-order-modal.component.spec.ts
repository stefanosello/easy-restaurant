import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { WaiterOrderModalComponent } from './waiter-order-modal.component';

describe('WaiterOrderModalComponent', () => {
  let component: WaiterOrderModalComponent;
  let fixture: ComponentFixture<WaiterOrderModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ WaiterOrderModalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WaiterOrderModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
