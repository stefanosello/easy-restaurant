import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CookOrderCardComponent } from './cook-order-card.component';

describe('CookOrderCardComponent', () => {
  let component: CookOrderCardComponent;
  let fixture: ComponentFixture<CookOrderCardComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CookOrderCardComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CookOrderCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
