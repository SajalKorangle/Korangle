import {async, ComponentFixture, fakeAsync, flush, TestBed, tick} from '@angular/core/testing';

import { DesignLayoutComponent } from '@modules/id-card/pages/design-layout/design-layout.component';
import { BasicComponentsModule } from '@basic-components/basic-components.module';
import { ComponentsModule } from '@components/components.module';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { DataStorage } from '@classes/data-storage';
import { USER_LIST } from '@test-data-source/classes/user';
import { SCHOOL_LIST } from '@test-data-source/classes/school';
import { StudentService } from '@services/modules/student/student.service';
import { StudentMockService } from '@mock-services/apps/student.mock.service';
import { MatButtonToggleModule, MatIconModule } from '@angular/material';
import { ColorPickerModule } from 'ngx-color-picker';
import { IdCardService } from '@services/modules/id-card/id-card.service';
import { ClassService } from '@services/modules/class/class.service';
import { FIELDS, PARAMETER_LIST } from '@modules/id-card/class/constants';
import { ApiVersion } from '@mock-api/api-version';
import { ID_CARD_LAYOUT_API } from '@mock-api/apps/id-card/id-card-layout.api';
import { STUDENT_SECTION_API } from '@mock-api/apps/student/student-section.api';
import {STUDENT_PARAMETER_VALUE_API} from '@mock-api/apps/student/student-parameter-value.api';
import {IdCardMockService} from '@mock-services/apps/id-card.mock.service';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';


describe('DesignLayoutComponent', () => {
    let component: DesignLayoutComponent;
    let fixture: ComponentFixture<DesignLayoutComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [ DesignLayoutComponent ],
            imports: [
                BasicComponentsModule, ComponentsModule, HttpClientTestingModule,
                MatButtonToggleModule, MatIconModule, ColorPickerModule, BrowserAnimationsModule
            ],
            providers: [IdCardService, StudentService, ClassService],
        }).overrideComponent(DesignLayoutComponent, {
            set: {
                providers: [
                    {provide: StudentService, useClass: StudentMockService},
                    {provide: IdCardService, useClass: IdCardMockService}
                ]
            }
        }).compileComponents();
        DataStorage.getInstance().setUser(USER_LIST[0]);
        DataStorage.getInstance().getUser().schoolList.push(SCHOOL_LIST[0]);
        DataStorage.getInstance().getUser().activeSchool = SCHOOL_LIST[0];
    }));

    beforeEach(async () => {
        fixture = TestBed.createComponent(DesignLayoutComponent);
        component = fixture.componentInstance;
        component.getDefaultBackground = () => { return null; };
        // await component.ngOnInit();
        // fixture.detectChanges();
    });

    // Component Functions
    it('Component -> populateCurrentLayoutWithEmptyDefaultData()', fakeAsync( () =>  {
        ApiVersion.getInstance().initializeAndSetVersion(ID_CARD_LAYOUT_API, 1);
        ApiVersion.getInstance().setVersion(STUDENT_SECTION_API, 1);
        ApiVersion.getInstance().setVersion(STUDENT_PARAMETER_VALUE_API, 1);
        component.ngOnInit();
        flush();
        component.populateCurrentLayoutWithEmptyDefaultData();
        expect(component.currentLayout.id).toBe(-1);
        expect(component.currentLayout.parentSchool).toBe(component.user.activeSchool.dbId);
        expect(component.currentLayout.name).toBe('');
        expect(component.currentLayout.content.length).toBe(0);
    }));

    it('Component -> populateCurrentLayoutWithGivenValue()', fakeAsync( () =>  {
        ApiVersion.getInstance().initializeAndSetVersion(ID_CARD_LAYOUT_API, 1);
        ApiVersion.getInstance().setVersion(STUDENT_SECTION_API, 1);
        ApiVersion.getInstance().setVersion(STUDENT_PARAMETER_VALUE_API, 1);
        component.ngOnInit();
        flush();
        component.populateCurrentLayoutWithGivenValue(component.idCardLayoutList[0]);
        const layout = component.idCardLayoutList[0];
        expect(component.currentLayout.id).toBe(layout.id);
        expect(component.currentLayout.parentSchool).toBe(component.user.activeSchool.dbId);
        expect(component.currentLayout.name).toBe(layout.name);
        expect(compareArray(component.currentLayout.content, JSON.parse(layout.content))).toBe(true);
    }));

    it('Component -> doesCurrentLayoutHasUniqueName() returns false', fakeAsync( () =>  {
        ApiVersion.getInstance().initializeAndSetVersion(ID_CARD_LAYOUT_API, 1);
        ApiVersion.getInstance().setVersion(STUDENT_SECTION_API, 1);
        ApiVersion.getInstance().setVersion(STUDENT_PARAMETER_VALUE_API, 1);
        component.ngOnInit();
        flush();
        component.populateCurrentLayoutWithEmptyDefaultData();
        component.currentLayout.name = 'Test Layout';
        expect(component.doesCurrentLayoutHasUniqueName()).toBe(false);
    }));

    it('Component -> doesCurrentLayoutHasUniqueName() returns true', fakeAsync( () =>  {
        ApiVersion.getInstance().initializeAndSetVersion(ID_CARD_LAYOUT_API, 1);
        ApiVersion.getInstance().setVersion(STUDENT_SECTION_API, 1);
        ApiVersion.getInstance().setVersion(STUDENT_PARAMETER_VALUE_API, 1);
        component.ngOnInit();
        flush();
        component.populateCurrentLayoutWithGivenValue(component.idCardLayoutList[0]);
        expect(component.doesCurrentLayoutHasUniqueName()).toBe(true);
    }));

    it('Component -> addToCurrentUserHandleList()', fakeAsync( () =>  {
        ApiVersion.getInstance().initializeAndSetVersion(ID_CARD_LAYOUT_API, 1);
        ApiVersion.getInstance().setVersion(STUDENT_SECTION_API, 1);
        ApiVersion.getInstance().setVersion(STUDENT_PARAMETER_VALUE_API, 1);
        component.ngOnInit();
        flush();
        component.populateCurrentLayoutWithGivenValue(component.idCardLayoutList[0]);
        const parameter = component.parameterList[0];
        component.addToCurrentUserHandleList(parameter);
        expect(component.currentLayout.content.length).toBe(1);
        expect(component.currentLayout.content[0].key).toBe(parameter.key);
    }));

    it('Component -> resetCurrentLayout()', fakeAsync( () =>  {
        ApiVersion.getInstance().initializeAndSetVersion(ID_CARD_LAYOUT_API, 1);
        ApiVersion.getInstance().setVersion(STUDENT_SECTION_API, 1);
        ApiVersion.getInstance().setVersion(STUDENT_PARAMETER_VALUE_API, 1);
        component.ngOnInit();
        flush();
        component.populateCurrentLayoutWithEmptyDefaultData();
        component.resetCurrentLayout();
        expect(component.currentLayout.id).toBe(-1);
        expect(component.currentLayout.parentSchool).toBe(component.user.activeSchool.dbId);
        expect(component.currentLayout.name).toBe('');
        expect(component.currentLayout.content.length).toBe(0);
    }));

    it('Component -> getFieldKeyList()', fakeAsync( () =>  {
        ApiVersion.getInstance().initializeAndSetVersion(ID_CARD_LAYOUT_API, 1);
        ApiVersion.getInstance().setVersion(STUDENT_SECTION_API, 1);
        ApiVersion.getInstance().setVersion(STUDENT_PARAMETER_VALUE_API, 1);
        component.ngOnInit();
        flush();
        const fieldKeyList = component.getFieldKeyList();
        expect(fieldKeyList.length).toBe(5);
    }));

    it('Component -> getFilteredParameterList()', fakeAsync( () =>  {
        ApiVersion.getInstance().initializeAndSetVersion(ID_CARD_LAYOUT_API, 1);
        ApiVersion.getInstance().setVersion(STUDENT_SECTION_API, 1);
        ApiVersion.getInstance().setVersion(STUDENT_PARAMETER_VALUE_API, 1);
        component.ngOnInit();
        flush();
        const fieldKeyList = component.getFieldKeyList();
        const parameterList = component.getFilteredParameterList(FIELDS[fieldKeyList[0]]);
        expect(parameterList.length).toBe(PARAMETER_LIST.filter(item => {
            return item.field === FIELDS[fieldKeyList[0]];
        }).length);
    }));

    // Checking if student custom parameter is added successfully
    it('Component -> getParameter()', fakeAsync( () =>  {
        ApiVersion.getInstance().initializeAndSetVersion(ID_CARD_LAYOUT_API, 1);
        ApiVersion.getInstance().setVersion(STUDENT_SECTION_API, 1);
        ApiVersion.getInstance().setVersion(STUDENT_PARAMETER_VALUE_API, 1);
        component.ngOnInit();
        flush();
        const parameter = component.getParameter(FIELDS.STUDENT_CUSTOM.fieldStructureKey + '-' + '1');
        expect(parameter.displayParameterNameFunc({data: component.data})).toBe('Test 1');
    }));

    it('serviceAdapter -> deleteLayout()', fakeAsync( () =>  {
        ApiVersion.getInstance().initializeAndSetVersion(ID_CARD_LAYOUT_API, 1);
        ApiVersion.getInstance().setVersion(STUDENT_SECTION_API, 1);
        ApiVersion.getInstance().setVersion(STUDENT_PARAMETER_VALUE_API, 1);
        component.ngOnInit();
        flush();
        component.populateCurrentLayoutWithGivenValue(component.idCardLayoutList[0]);
        component.serviceAdapter.deleteLayout();
        flush();
        expect(component.idCardLayoutList.length).toBe(0);
    }));

    function compareArray(a: any, b: any): boolean {
        // if length is not equal
        if (a.length !== b.length) {
            return false;
        } else {
            // comapring each element of array
            for (let i = 0; i < a.length; i++) {
                if (a[i] !== b[i]) {
                    return false;
                }
            }
            return true;
        }
    }

});
