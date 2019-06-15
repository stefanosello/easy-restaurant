import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CashdeskAddCardModalComponent } from './cashdesk-add-card-modal.component';

describe('CashdeskAddCardModalComponent', () => {
  let component: CashdeskAddCardModalComponent;
  let fixture: ComponentFixture<CashdeskAddCardModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CashdeskAddCardModalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CashdeskAddCardModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
