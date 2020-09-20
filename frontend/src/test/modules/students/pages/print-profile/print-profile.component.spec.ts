import {async, ComponentFixture, fakeAsync, TestBed, tick} from '@angular/core/testing';

import { PrintProfileComponent } from '@modules/students/pages/print-profile/print-profile.component';
import {BasicComponentsModule} from '@basic-components/basic-components.module';
import {ComponentsModule} from '@components/components.module';
import {HttpClientTestingModule} from '@angular/common/http/testing';
import {ExaminationService} from '@services/modules/examination/examination.service';
import {DataStorage} from '@classes/data-storage';
import {USER_LIST} from 'test-data-source/classes/user';
import {SCHOOL_LIST} from 'test-data-source/classes/school';
import {SchoolService} from '@services/modules/school/school.service';
import {StudentService} from '@services/modules/student/student.service';
import {ClassService} from '@services/modules/class/class.service';
import {SubjectService} from '@services/modules/subject/subject.service';
import {FeeService} from '@services/modules/fees/fee.service';
import {PrintService} from 'app/print/print-service';
import {RouterTestingModule} from '@angular/router/testing';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {BOARD_LIST} from 'test-data-source/services/modules/school/board';
import {SESSION_LIST} from 'test-data-source/services/modules/school/session';
import {BUS_STOP_LIST} from 'test-data-source/services/modules/team/bus-stop';
import {CLASS_LIST} from 'test-data-source/classes/class';
import {SECTION_LIST} from 'test-data-source/classes/division';
import {STUDENT_LIST} from 'test-data-source/services/modules/students/students';
import {STUDENT_SECTION_LIST} from 'test-data-source/services/modules/students/student-section';

class MockSchoolService extends SchoolService {

  getObjectList(object_url, data): Promise<any> {
    if (object_url === this.session) {
      return Promise.resolve(SESSION_LIST);
    } else {
      return Promise.resolve([]);
    }
  }

  createObject(object_url, data): Promise<any> {
    if (object_url === this.board) {
      return Promise.resolve(BOARD_LIST);
    } else {
      return Promise.resolve([]);
    }
  }

  deleteObject(object_url, data): Promise<any> {
    if (object_url === this.bus_stop) {
      return Promise.resolve(BUS_STOP_LIST);
    } else {
      return Promise.resolve([]);
    }
  }

}

describe('PrintProfileComponent', () => {
  let component: PrintProfileComponent;
  let fixture: ComponentFixture<PrintProfileComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PrintProfileComponent ],
      imports: [ BasicComponentsModule, ComponentsModule, HttpClientTestingModule, RouterTestingModule, BrowserAnimationsModule ],
      providers: [ SchoolService, StudentService, ClassService, SubjectService, ExaminationService, FeeService, PrintService ],
    }).overrideComponent(PrintProfileComponent, {
      set: {
        providers: [
          {provide: SchoolService, useClass: MockSchoolService}
        ]
      }
    }).compileComponents();
    DataStorage.getInstance().setUser(USER_LIST[0]);
    DataStorage.getInstance().getUser().schoolList.push(SCHOOL_LIST[0]);
    DataStorage.getInstance().getUser().activeSchool = SCHOOL_LIST[0];
  }));

  beforeEach(async () => {
    fixture = TestBed.createComponent(PrintProfileComponent);
    component = fixture.componentInstance;
    await component.ngOnInit();
    fixture.detectChanges();
  });

  it('Custom Input Check', fakeAsync(() => {
    spyOn(TestBed.get(StudentService),'getObject').and.callFake(function () {
      if(arguments[0]=='/students'){
        return Promise.resolve(STUDENT_LIST[0]);
      }
    });
    CLASS_LIST.forEach(classs => {
      classs['dbId'] = classs['id'];
    });
    component.handleDetailsFromParentStudentFilter({'classList' : CLASS_LIST, 'sectionList': SECTION_LIST});
    component.handleStudentListSelection([STUDENT_LIST,STUDENT_SECTION_LIST]);
    tick();
    expect().nothing();
  }));
});
