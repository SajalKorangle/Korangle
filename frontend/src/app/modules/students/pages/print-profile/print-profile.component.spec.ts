import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PrintProfileComponent } from './print-profile.component';

describe('PrintProfileComponent', () => {
  let component: PrintProfileComponent;
  let fixture: ComponentFixture<PrintProfileComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PrintProfileComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PrintProfileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
