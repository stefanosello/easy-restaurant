import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CashdeskInfoModalComponent } from './cashdesk-info-modal.component';

describe('CashdeskInfoModalComponent', () => {
  let component: CashdeskInfoModalComponent;
  let fixture: ComponentFixture<CashdeskInfoModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CashdeskInfoModalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CashdeskInfoModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
