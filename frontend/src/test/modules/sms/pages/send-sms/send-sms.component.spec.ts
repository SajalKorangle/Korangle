import {async, ComponentFixture, fakeAsync, flush, TestBed, tick} from '@angular/core/testing';

import { SendSmsComponent } from '@modules/sms/pages/send-sms/send-sms.component';
import { BasicComponentsModule } from '@basic-components/basic-components.module';
import { ComponentsModule } from '@components/components.module';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { DataStorage } from '@classes/data-storage';
import { USER_LIST } from 'test-data-source/classes/user';
import { SCHOOL_LIST } from 'test-data-source/classes/school';
import { StudentService } from '@services/modules/student/student.service';
import { StudentMockService } from '@mock-services/apps/student.mock.service';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ClassService } from '../../../../../app/services/modules/class/class.service';
import { EmployeeService } from '../../../../../app/services/modules/employee/employee.service';
import { NotificationService } from '../../../../../app/services/modules/notification/notification.service';
import { UserService } from '../../../../../app/services/modules/user/user.service';
import { SmsService } from '../../../../../app/services/modules/sms/sms.service';
import {NgxDatatableModule} from '@swimlane/ngx-datatable';
import {SmsOldService} from '../../../../../app/services/modules/sms/sms-old.service';


describe('SendSmsComponent', () => {
    let component: SendSmsComponent;
    let fixture: ComponentFixture<SendSmsComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [ SendSmsComponent ],
            imports: [
                BasicComponentsModule, ComponentsModule, HttpClientTestingModule,
                BrowserAnimationsModule, NgxDatatableModule
            ],
            providers: [ StudentService, ClassService, EmployeeService, NotificationService, UserService, SmsService, SmsOldService ],
        }).overrideComponent(SendSmsComponent, {
            set: {
                providers: [
                    {provide: StudentService, useClass: StudentMockService},
                ]
            }
        }).compileComponents();
        DataStorage.getInstance().setUser(USER_LIST[0]);
        DataStorage.getInstance().getUser().schoolList.push(SCHOOL_LIST[0]);
        DataStorage.getInstance().getUser().activeSchool = SCHOOL_LIST[0];
    }));

    beforeEach(async () => {
        fixture = TestBed.createComponent(SendSmsComponent);
        component = fixture.componentInstance;
        // await component.ngOnInit();
        // fixture.detectChanges();
    });

    // Component Functions
    it('Component -> hasUnicode() return true', fakeAsync( () =>  {
        component.message = 'This message contains देवनागरी';
        expect(component.hasUnicode()).toBe(true);
    }));

    it('Component -> hasUnicode() return false', fakeAsync( () =>  {
        component.message = 'This is a normal English message';
        expect(component.hasUnicode()).toBe(false);
    }));

    function compareArray(a: any, b: any): boolean {
        // if length is not equal
        if (a.length !== b.length) {
            return false;
        } else {
            // comapring each element of array
            for (let i = 0; i < a.length; i++) {
                if (a[i] !== b[i]) {
                    console.log(a[i]);
                    console.log(b[i]);
                    return false;
                }
            }
            return true;
        }
    }

});
