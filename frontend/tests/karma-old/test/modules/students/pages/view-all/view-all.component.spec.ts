import {async, ComponentFixture, fakeAsync, TestBed, tick} from '@angular/core/testing';

import { ViewAllComponent } from '@modules/students/pages/view-all/view-all.component';
import {ComponentsModule} from '@components/components.module';
import {HttpClientTestingModule} from '@angular/common/http/testing';
import {DataStorage} from '@classes/data-storage';
import {USER_LIST} from '@test-data-source/classes/user';
import {SCHOOL_LIST} from '@test-data-source/classes/school';
import {SchoolService} from '@services/modules/school/school.service';
import {StudentService} from '@services/modules/student/student.service';
import {ClassService} from '@services/modules/class/class.service';
import {RouterTestingModule} from '@angular/router/testing';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {StudentOldService} from '@services/modules/student/student-old.service';
import {ExcelService} from '@app/excel/excel-service';
import {BusStopService} from '@app/services/modules/school/bus-stop.service';

describe('ViewAllComponent', () => {
  let component: ViewAllComponent;
  let fixture: ComponentFixture<ViewAllComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ViewAllComponent ],
      imports: [ ComponentsModule, HttpClientTestingModule, RouterTestingModule, BrowserAnimationsModule ],
      providers: [StudentService, StudentOldService, ClassService, ExcelService, BusStopService, SchoolService],
    }).overrideComponent(ViewAllComponent, {
      set: {
        providers: [
          // {provide: SchoolService, useClass: MockSchoolService}
        ]
      }
    }).compileComponents();
    DataStorage.getInstance().setUser(USER_LIST[0]);
    DataStorage.getInstance().getUser().schoolList.push(SCHOOL_LIST[0]);
    DataStorage.getInstance().getUser().activeSchool = SCHOOL_LIST[0];
  }));

  beforeEach(async () => {
    fixture = TestBed.createComponent(ViewAllComponent);
    component = fixture.componentInstance;
    await component.ngOnInit();
    fixture.detectChanges();
  });

});
