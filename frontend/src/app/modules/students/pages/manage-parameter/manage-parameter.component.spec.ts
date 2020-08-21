import {async, ComponentFixture, fakeAsync, TestBed, tick} from '@angular/core/testing';

import { ManageParameterComponent } from './manage-parameter.component';
import {BasicComponentsModule} from '../../../../basic-components/basic-components.module';
import {ComponentsModule} from '../../../../components/components.module';
import {HttpClientTestingModule} from '@angular/common/http/testing';
import {DataStorage} from '../../../../classes/data-storage';
import {USER_LIST} from '../../../../../test-data-source/classes/user';
import {SCHOOL_LIST} from '../../../../../test-data-source/classes/school';
import {MatIconModule} from '@angular/material';
import {StudentService} from '../../../../services/modules/student/student.service';
import {STUDENT_PARAMETER_LIST} from '../../../../../test-data-source/services/modules/students/student-parameter';

class MockStudentService extends StudentService {

    getObjectList(object_url, data): Promise<any> {
        if (object_url === this.student_parameter) {
            return Promise.resolve(STUDENT_PARAMETER_LIST);
        } else {
            return Promise.resolve([]);
        }
    }

    createObject(object_url, data): Promise<any> {
        if (object_url === this.student_parameter) {
            data.id = 342;
            return Promise.resolve(data);
        } else {
            return Promise.resolve([]);
        }
    }

    deleteObject(object_url, data): Promise<any> {
        if (object_url === this.student_parameter) {
            return Promise.resolve(data.id);
        } else {
            return Promise.resolve([]);
        }
    }

}

describe('ManageParameterComponent', () => {
    let component: ManageParameterComponent;
    let fixture: ComponentFixture<ManageParameterComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [ ManageParameterComponent ],
            imports: [ BasicComponentsModule, ComponentsModule, HttpClientTestingModule, MatIconModule ],
            providers: [ StudentService ],
        }).overrideComponent(ManageParameterComponent, {
            set: {
                providers: [
                    {provide: StudentService, useClass: MockStudentService}
                ]
            }
        }).compileComponents();
        DataStorage.getInstance().setUser(USER_LIST[0]);
        DataStorage.getInstance().getUser().schoolList.push(SCHOOL_LIST[0]);
        DataStorage.getInstance().getUser().activeSchool = SCHOOL_LIST[0];
    }));

    beforeEach(async () => {
        fixture = TestBed.createComponent(ManageParameterComponent);
        component = fixture.componentInstance;
        await component.ngOnInit();
        fixture.detectChanges();
    });

    it('Component -> addNewParameter()', async () =>  {
        component.addNewParameter();
        expect(component.currentParameter.parentSchool).toBe(component.user.activeSchool.dbId);
        expect(component.currentParameter.name).toBe('');
        expect(component.currentParameter.parameterType).toBe(component.customParameterTypeList[0]);
        expect(component.currentParameter.filterValues.length).toBe(0);
    });

    it('Component -> setActiveParameter()', async () =>  {
        component.setActiveParameter({
            'id': 1,
            'parentSchool': component.user.activeSchool.dbId,
            'name': 'Test Parameter',
            'parameterType': component.customParameterTypeList[0],
            'filterValues': JSON.stringify([])
        });
        expect(component.currentParameter.id).toBe(1);
        expect(component.currentParameter.parentSchool).toBe(component.user.activeSchool.dbId);
        expect(component.currentParameter.name).toBe('Test Parameter');
        expect(component.currentParameter.parameterType).toBe(component.customParameterTypeList[0]);
        expect(component.currentParameter.filterValues.length).toBe(0);
        expect(component.oldFilterValueList.length).toBe(0);
    });

    it('Service Adapter -> initializeData()', async () =>  {
        console.log(component.customParameterList);
        expect(component.isLoading).toBe(false);
        expect(compareArray(component.customParameterList, STUDENT_PARAMETER_LIST)).toBe(true);
    });

    it('Service Adapter -> saveParameter() new parameter', fakeAsync (() =>  {
        component.addNewParameter();
        component.currentParameter.name = 'Test Parameter 4';
        const parameterListLength = component.customParameterList.length;
        component.serviceAdapter.saveParameter();
        tick(500);
        expect(component.isLoading).toBe(false);
        expect(component.customParameterList[component.customParameterList.length-1].name).toBe('Test Parameter 4');
        expect(component.customParameterList.length).toBe(parameterListLength+1);
    }));

    it('Service Adapter -> deleteParameter() user confirmation', async () =>  {
        component.setActiveParameter(component.customParameterList[0]);
        const currentId = component.currentParameter.id;
        const parameterListLength = component.customParameterList.length;
        window.confirm = () => { return true; };
        await component.serviceAdapter.deleteParameter();
        expect(component.isLoading).toBe(false);
        expect(component.customParameterList.filter(x => {return x.id === currentId;}).length).toBe(0);
        expect(component.currentParameter).toBe(null);
        expect(component.customParameterList.length).toBe(parameterListLength-1);
    });

    it('Service Adapter -> deleteParameter() user cancellation', async () =>  {
        component.setActiveParameter(component.customParameterList[0]);
        const currentId = component.currentParameter.id;
        const parameterListLength = component.customParameterList.length;
        window.confirm = () => { return false; };
        await component.serviceAdapter.deleteParameter();
        expect(component.isLoading).toBe(false);
        expect(component.customParameterList.filter(x => {return x.id === currentId;}).length).toBe(1);
        expect(component.currentParameter.id).toBe(currentId);
        expect(component.customParameterList.length).toBe(parameterListLength);
    });

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
