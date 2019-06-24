import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BartenderOrderCardComponent } from './bartender-order-card.component';

describe('BartenderOrderCardComponent', () => {
  let component: BartenderOrderCardComponent;
  let fixture: ComponentFixture<BartenderOrderCardComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BartenderOrderCardComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BartenderOrderCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
