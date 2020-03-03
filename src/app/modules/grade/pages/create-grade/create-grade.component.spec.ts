import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateGradeComponent } from './create-grade.component';

describe('CreateGradeComponent', () => {
  let component: CreateGradeComponent;
  let fixture: ComponentFixture<CreateGradeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CreateGradeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateGradeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
