import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { WaiterTableCardComponent } from './waiter-table-card.component';

describe('WaiterTableCardComponent', () => {
  let component: WaiterTableCardComponent;
  let fixture: ComponentFixture<WaiterTableCardComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ WaiterTableCardComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WaiterTableCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
