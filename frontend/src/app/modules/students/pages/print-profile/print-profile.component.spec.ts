import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PrintProfileComponent } from './print-profile.component';
import {BasicComponentsModule} from '../../../../basic-components/basic-components.module';
import {ComponentsModule} from '../../../../components/components.module';
import {HttpClientTestingModule} from '@angular/common/http/testing';
import {ExaminationService} from '../../../../services/modules/examination/examination.service';
import {DataStorage} from '../../../../classes/data-storage';
import {USER_LIST} from '../../../../../test-data-source/classes/user';
import {SCHOOL_LIST} from '../../../../../test-data-source/classes/school';
import {SchoolService} from '../../../../services/modules/school/school.service';
import {StudentService} from '../../../../services/modules/student/student.service';
import {ClassOldService} from '../../../../services/modules/class/class-old.service';
import {SubjectService} from '../../../../services/modules/subject/subject.service';
import {FeeService} from '../../../../services/modules/fees/fee.service';
import {PrintService} from '../../../../print/print-service';
import {RouterTestingModule} from '@angular/router/testing';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';

describe('PrintProfileComponent', () => {
  let component: PrintProfileComponent;
  let fixture: ComponentFixture<PrintProfileComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PrintProfileComponent ],
      imports: [ BasicComponentsModule, ComponentsModule, HttpClientTestingModule, RouterTestingModule, BrowserAnimationsModule ],
      providers: [ SchoolService, StudentService, ClassOldService, SubjectService, ExaminationService, FeeService, PrintService ],
    }).overrideComponent(PrintProfileComponent, {
      set: {
        providers: [
          //{provide: ExaminationService, useClass: MockExaminationService}
        ]
      }
    }).compileComponents();
    DataStorage.getInstance().setUser(USER_LIST[0]);
    DataStorage.getInstance().getUser().schoolList.push(SCHOOL_LIST[0]);
    DataStorage.getInstance().getUser().activeSchool = SCHOOL_LIST[0];
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PrintProfileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect().nothing();
  });
});
