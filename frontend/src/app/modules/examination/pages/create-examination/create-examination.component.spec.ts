import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateExaminationComponent } from './create-examination.component';
import {BasicComponentsModule} from '../../../../basic-components/basic-components.module';
import {ComponentsModule} from '../../../../components/components.module';
import {ExaminationService} from '../../../../services/modules/examination/examination.service';
import {HttpClientTestingModule} from '@angular/common/http/testing';
import {DataStorage} from '../../../../classes/data-storage';
import {USER_LIST} from '../../../../../test-data-source/classes/user';
import {SCHOOL_LIST} from '../../../../../test-data-source/classes/school';
import {EXAMINATION_LIST} from '../../../../../test-data-source/services/modules/examination/models/examination';

class MockExaminationService {

    getObjectList(): Promise<any> {
        return Promise.resolve([EXAMINATION_LIST[0]]);
    }

    createObject(): Promise<any> {
        return Promise.resolve(EXAMINATION_LIST[1]);
    }

}

describe('CreateExaminationComponent', () => {
    let component: CreateExaminationComponent;
    let fixture: ComponentFixture<CreateExaminationComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [ CreateExaminationComponent ],
            imports: [ BasicComponentsModule, ComponentsModule, HttpClientTestingModule ],
            providers: [ ExaminationService ],
        }).overrideComponent(CreateExaminationComponent, {
            set: {
                providers: [
                    {provide: ExaminationService, useClass: MockExaminationService}
                ]
            }
        }).compileComponents();
        DataStorage.getInstance().setUser(USER_LIST[0]);
        DataStorage.getInstance().getUser().schoolList.push(SCHOOL_LIST[0]);
        DataStorage.getInstance().getUser().activeSchool = SCHOOL_LIST[0];
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(CreateExaminationComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
        component.examinationList = [EXAMINATION_LIST[0]];
    });

    it('Add Examination', async () => {
        // spyOn(component.examinationService, 'createObject').and.returnValue(EXAMINATION_LIST[1]);
        component.examinationNameToBeAdded = 'Dummy 2';
        await component.serviceAdapter.createExamination();
        expect(component.examinationList.length).toBe(2);
    });

    it('check name already exists', () => {
        // spyOn(component.examinationService, 'createObject').and.returnValue(EXAMINATION_LIST[0]);
        component.examinationNameToBeAdded = 'Dummy';
        component.serviceAdapter.createExamination();
        /*spyOn(window, 'alert');
        expect(alert).toHaveBeenCalledWith('Examination Name already Exists');*/
        expect(component.examinationList.length).toBe(1);
    });

});
