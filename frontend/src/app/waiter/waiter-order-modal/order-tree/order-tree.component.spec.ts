import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OrderTreeComponent } from './order-tree.component';

describe('OrderTreeComponent', () => {
  let component: OrderTreeComponent;
  let fixture: ComponentFixture<OrderTreeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OrderTreeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OrderTreeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
