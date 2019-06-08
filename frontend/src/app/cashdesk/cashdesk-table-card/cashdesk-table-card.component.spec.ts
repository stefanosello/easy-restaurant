import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CashdeskTableCardComponent } from './cashdesk-table-card.component';

describe('CashdeskTableCardComponent', () => {
  let component: CashdeskTableCardComponent;
  let fixture: ComponentFixture<CashdeskTableCardComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CashdeskTableCardComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CashdeskTableCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
