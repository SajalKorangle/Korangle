import {async, ComponentFixture, fakeAsync, flush, TestBed, tick} from '@angular/core/testing';

import { ManageParameterComponent } from '@modules/students/pages/manage-parameter/manage-parameter.component';
import {BasicComponentsModule} from '@basic-components/basic-components.module';
import {ComponentsModule} from '@components/components.module';
import {HttpClientTestingModule} from '@angular/common/http/testing';
import {DataStorage} from '@classes/data-storage';
import {USER_LIST} from 'test-data-source/classes/user';
import {SCHOOL_LIST} from 'test-data-source/classes/school';
import {MatIconModule} from '@angular/material';
import {StudentService} from '@services/modules/student/student.service';
import {ApiVersion} from '@mock-api/api-version';
import {STUDENT_PARAMETER_API} from '@mock-api/apps/student/student-parameter.api';
import {StudentMockService} from '@mock-services/apps/student.mock.service';

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
                    {provide: StudentService, useClass: StudentMockService}
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
    });

    it('Component -> addNewParameter()', async () =>  {
        ApiVersion.getInstance().initializeAndSetVersion(STUDENT_PARAMETER_API, 1);
        await component.ngOnInit();
        fixture.detectChanges();
        component.addNewParameter();
        expect(component.currentParameter.parentSchool).toBe(component.user.activeSchool.dbId);
        expect(component.currentParameter.name).toBe('');
        expect(component.currentParameter.parameterType).toBe(component.customParameterTypeList[0]);
        expect(component.currentParameter.filterValues.length).toBe(0);
    });

    it('Component -> setActiveParameter()', async () =>  {
        ApiVersion.getInstance().initializeAndSetVersion(STUDENT_PARAMETER_API, 1);
        await component.ngOnInit();
        fixture.detectChanges();
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

    it('Component -> addFilter()', fakeAsync( () =>  {
        ApiVersion.getInstance().initializeAndSetVersion(STUDENT_PARAMETER_API, 1);
        component.ngOnInit();
        flush();
        component.chooseParameter(component.ADD_PARAMETER_STRING);
        component.addFilter('Testing');
        expect(component.currentParameter.filterValues[component.currentParameter.filterValues.length - 1]).toBe( 'Testing');
        component.addFilter('Testing - 2 ');
        expect(component.currentParameter.filterValues[component.currentParameter.filterValues.length - 1]).toBe( 'Testing - 2');
    }));

    it('Service Adapter -> initializeData()', fakeAsync( () =>  {
        ApiVersion.getInstance().initializeAndSetVersion(STUDENT_PARAMETER_API, 1);
        component.ngOnInit();
        flush();
        expect(component.isLoading).toBe(false);
        expect(compareArray(component.customParameterList, STUDENT_PARAMETER_API.version_list[0].list)).toBe(true);
    }));

    it('Service Adapter -> saveParameter() new parameter', fakeAsync (() =>  {
        ApiVersion.getInstance().initializeAndSetVersion(STUDENT_PARAMETER_API, 1);
        component.ngOnInit();
        flush();
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
        ApiVersion.getInstance().initializeAndSetVersion(STUDENT_PARAMETER_API, 1);
        await component.ngOnInit();
        fixture.detectChanges();
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
        ApiVersion.getInstance().initializeAndSetVersion(STUDENT_PARAMETER_API, 1);
        await component.ngOnInit();
        fixture.detectChanges();
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
