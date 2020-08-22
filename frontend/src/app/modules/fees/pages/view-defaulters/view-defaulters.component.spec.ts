import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewDefaultersComponent} from './view-defaulters.component';
import {BasicComponentsModule} from '../../../../basic-components/basic-components.module';
import {ComponentsModule} from '../../../../components/components.module';
import {HttpClientTestingModule} from '@angular/common/http/testing';
import {DataStorage} from '../../../../classes/data-storage';
import {USER_LIST} from '../../../../../test-data-source/classes/user';
import {SCHOOL_LIST} from '../../../../../test-data-source/classes/school';
import {FeeService} from '../../../../services/modules/fees/fee.service';
import {StudentService} from '../../../../services/modules/student/student.service';
import {ClassOldService} from '../../../../services/modules/class/class-old.service';
import {NotificationService} from '../../../../services/modules/notification/notification.service';
import {UserService} from '../../../../services/modules/user/user.service';
import {SmsService} from '../../../../services/modules/sms/sms.service';
import {SmsOldService} from '../../../../services/modules/sms/sms-old.service';
import {SchoolService} from '../../../../services/modules/school/school.service';
import {SESSION_LIST} from '../../../../../test-data-source/services/modules/school/session';
import {CLASS_LIST} from '../../../../../test-data-source/classes/class';
import {SECTION_LIST} from '../../../../../test-data-source/classes/division';
import {PrintService} from '../../../../print/print-service';
import {ExcelService} from '../../../../excel/excel-service';
import {ChangeDetectorRef} from '@angular/core';

export const STUDENT_LIST = [
    {
        name : 'Student 1',
        fathersName : 'Father',
        class : {
            name : 'Class - 12'
        },
        section : {
            name : 'Section - A'
        },
        mobileNumber : '1234567891',
        secondMobileNumber : '7418529637',
        feesDueTillMonth : 5000,
        feesDueOverall : 6000,
        totalFeesThisSession : 8000,
        feesPaidThisSession : 4000,
        discountThisSession : 1000
    },
];


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

describe('ViewDefaultersComponent', () => {
    let component: ViewDefaultersComponent;
    let fixture: ComponentFixture<ViewDefaultersComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [ ViewDefaultersComponent ],
            imports: [ BasicComponentsModule, ComponentsModule, HttpClientTestingModule ],
            providers: [SchoolService, FeeService, StudentService, ClassOldService, ExcelService, NotificationService, UserService, SmsService, SmsOldService, ChangeDetectorRef, PrintService],
        }).overrideComponent(ViewDefaultersComponent, {
            set: {
                providers: [
                    {provide: PrintService, useClass: MockPrintService}
                ]
            }
        }).compileComponents();
        DataStorage.getInstance().setUser(USER_LIST[0]);
        DataStorage.getInstance().getUser().schoolList.push(SCHOOL_LIST[0]);
        DataStorage.getInstance().getUser().activeSchool = SCHOOL_LIST[0];
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(ViewDefaultersComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
        component.sessionList = SESSION_LIST;
        component.classList = CLASS_LIST;
        component.sectionList = SECTION_LIST;
        component.studentList = STUDENT_LIST;
        component.selectedFilterType = 'Student';
        component.studentParameterList = [];
    });

    it('Testing printFeesReport() for Student',  () => {
        component.printFeesReport();
        expect().nothing();
    });

});
