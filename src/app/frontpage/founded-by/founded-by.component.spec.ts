import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FoundedByComponent } from './founded-by.component';

describe('FoundedByComponent', () => {
  let component: FoundedByComponent;
  let fixture: ComponentFixture<FoundedByComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FoundedByComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FoundedByComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
