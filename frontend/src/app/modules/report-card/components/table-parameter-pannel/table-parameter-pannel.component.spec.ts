import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TableParameterPannelComponent } from './table-parameter-pannel.component';

describe('TableParameterPannelComponent', () => {
  let component: TableParameterPannelComponent;
  let fixture: ComponentFixture<TableParameterPannelComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TableParameterPannelComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TableParameterPannelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
