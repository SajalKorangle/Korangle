import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { WhyKorangleComponent } from './why-korangle.component';

describe('WhyKorangleComponent', () => {
  let component: WhyKorangleComponent;
  let fixture: ComponentFixture<WhyKorangleComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ WhyKorangleComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WhyKorangleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
