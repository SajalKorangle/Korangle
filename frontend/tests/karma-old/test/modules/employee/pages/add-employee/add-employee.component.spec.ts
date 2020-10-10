import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddEmployeeComponent} from '@modules/employee/pages/add-employee/add-employee.component';
import {BasicComponentsModule} from '@basic-components/basic-components.module';
import {ComponentsModule} from '@components/components.module';
import {EmployeeOldService} from '@services/modules/employee/employee-old.service';
import {EmployeeService} from '@services/modules/employee/employee.service';
import {HttpClientTestingModule} from '@angular/common/http/testing';
import {DataStorage} from '@classes/data-storage';
import {USER_LIST} from '@test-data-source/classes/user';
import {SCHOOL_LIST} from '@test-data-source/classes/school';
import {EMPLOYEE_LIST} from '@test-data-source/services/modules/employee/models/employee';
import {EMPLOYEE_SESSION_DETAIL} from '@test-data-source/services/modules/employee/models/employee-seesion-detail';
import {BankService} from '@services/bank.service';
import {TeamService} from '@services/modules/team/team.service';
import {EMPLOYEE_MINI_PROFILES} from '@test-data-source/services/modules/employee/models/employee-mini-profile';
import {MODULE_LIST} from '@test-data-source/services/modules/team/module';
import {TASK_LIST} from '@test-data-source/services/modules/team/task';

class MockTeamService {
    getObjectList(object_url, data): Promise<any> {
        if (object_url === '/module') {
            return Promise.resolve(MODULE_LIST);
        }
        else if (object_url == '/task') {
            return Promise.resolve(TASK_LIST);
        }
    }
}

class MockEmployeeService {

    // getObjectList(): Promise<any> {
    //     return Promise.resolve([EXAMINATION_LIST[0]]);
    // }

    createObjectList(): Promise<any> {
        return Promise.resolve([]);
    }

}

class MockEmployeeOldService {

    getEmployeeMiniProfileList(): Promise<any> {
        return Promise.resolve(EMPLOYEE_MINI_PROFILES[0]);
    }

    createEmployeeProfile(): Promise<any> {
        return Promise.resolve({
            id: EMPLOYEE_LIST[0].id,
            message: "Employee Profile created successfully"
        });
    }

    createEmployeeSessionDetail(): Promise<any> {
        return Promise.resolve({
            id: EMPLOYEE_SESSION_DETAIL[0].id,
            message: "Employee Session created successfully"
        });
    }

}

describe('CreateExaminationComponent', () => {

    let component: AddEmployeeComponent;
    let fixture: ComponentFixture<AddEmployeeComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [ AddEmployeeComponent ],
            imports: [ BasicComponentsModule, ComponentsModule, HttpClientTestingModule ],
            providers: [ BankService, TeamService, EmployeeService, EmployeeOldService ],
        }).overrideComponent(AddEmployeeComponent, {
            set: {
                providers: [
                    {provide: EmployeeService, useClass: MockEmployeeService},
                    {provide: EmployeeOldService, useClass: MockEmployeeOldService}
                ]
            }
        }).compileComponents();
        DataStorage.getInstance().setUser(USER_LIST[0]);
        DataStorage.getInstance().getUser().schoolList.push(SCHOOL_LIST[1]);
        DataStorage.getInstance().getUser().activeSchool = SCHOOL_LIST[1];
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(AddEmployeeComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
        component.moduleList = MODULE_LIST;
    });

    it('Create Employee', async () => {
        // spyOn(component.examinationService, 'createObject').and.returnValue(EXAMINATION_LIST[1]);

        component.newEmployee = EMPLOYEE_LIST[0];
        await component.createNewEmployee();
        expect().nothing();
    });

});
