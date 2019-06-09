import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CashdeskBillModalComponent } from './cashdesk-bill-modal.component';

describe('CashdeskBillModalComponent', () => {
  let component: CashdeskBillModalComponent;
  let fixture: ComponentFixture<CashdeskBillModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CashdeskBillModalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CashdeskBillModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
