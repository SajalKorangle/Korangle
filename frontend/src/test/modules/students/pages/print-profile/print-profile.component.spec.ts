/*
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PrintProfileComponent } from '@modules/students/pages/print-profile/print-profile.component';
import {ComponentsModule} from '@components/components.module';
import {HttpClientTestingModule} from '@angular/common/http/testing';
import {BasicComponentsModule} from '@basic-components/basic-components.module';
import {PrintService} from 'app/print/print-service';
import {ViewDefaultersComponent} from '@modules/fees/pages/view-defaulters/view-defaulters.component';

class MockPrintService {

  template;

  navigateToPrintRoute(route,data){
    console.log("MOCK SERVICE CALLED  ", data.template);
    this.template = data.template;
  }

  // getObjectList(): Promise<any> {
  //     return Promise.resolve([EXAMINATION_LIST[0]]);
  // }
  //
  // createObject(): Promise<any> {
  //     return Promise.resolve(EXAMINATION_LIST[1]);
  // }

}

describe('PrintProfileComponent', () => {
  let component: PrintProfileComponent;
  let fixture: ComponentFixture<PrintProfileComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PrintProfileComponent ],
      imports: [ BasicComponentsModule, ComponentsModule, HttpClientTestingModule ],
      providers: [ PrintService ]
    }).overrideComponent(ViewDefaultersComponent, {
      set: {
        providers: [
          {provide: PrintService, useClass: MockPrintService}
        ]
      }
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
*/
