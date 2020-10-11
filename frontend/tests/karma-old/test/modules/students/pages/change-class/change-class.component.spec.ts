import {async, ComponentFixture, fakeAsync, TestBed, tick} from '@angular/core/testing';

import { ChangeClassComponent} from '@modules/students/pages/change-class/change-class.component';
import {BasicComponentsModule} from '@basic-components/basic-components.module';
import {ComponentsModule} from '@components/components.module';
import {HttpClientTestingModule} from '@angular/common/http/testing';
import {DataStorage} from '@classes/data-storage';
import {USER_LIST} from '@test-data-source/classes/user';
import {SCHOOL_LIST} from '@test-data-source/classes/school';
import {CLASS_LIST} from '@test-data-source/classes/class';
import {SECTION_LIST} from '@test-data-source/classes/division';
import {StudentService} from '@services/modules/student/student.service';
import {STUDENT_LIST} from '@test-data-source/services/modules/students/students';
import {STUDENT_SECTION_LIST} from '@test-data-source/services/modules/students/student-section';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';

describe('ChangeClassComponent', () => {
    let component: ChangeClassComponent;
    let fixture: ComponentFixture<ChangeClassComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [ ChangeClassComponent ],
            imports: [ BasicComponentsModule, ComponentsModule, HttpClientTestingModule, BrowserAnimationsModule ],
            providers: [ StudentService ],
        }).overrideComponent(ChangeClassComponent, {
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
        fixture = TestBed.createComponent(ChangeClassComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
        CLASS_LIST.forEach(classs => {
            classs['dbId'] = classs['id'];
        });
        component.handleDetailsFromParentStudentFilter({'classList' : CLASS_LIST, 'sectionList': SECTION_LIST});
        component.handleStudentListSelection([STUDENT_LIST,STUDENT_SECTION_LIST]);
    });

    it('Change Class And Section', fakeAsync(() => {
        fixture.detectChanges();
        component.selectedClass = component.classSectionList[2];
        component.selectedClass.selectedSection = component.selectedClass['sectionList'][2];
        spyOn(TestBed.get(StudentService),'partiallyUpdateObject').and.callFake(function () {
            if(arguments[0]=='/student-sections'){
                let studentSection = STUDENT_SECTION_LIST[0];
                studentSection['parentDivision'] = component.selectedClass['id'];
                studentSection['parentClass'] = component.selectedClass.selectedSection['id'];
                return Promise.resolve(studentSection);
            }
        });
        component.changeClassSection();
        tick();
        expect(component.selectedStudentSection.parentDivision).toBe(CLASS_LIST[2]['id']);
        expect(component.selectedStudentSection.parentClass).toBe(SECTION_LIST[2]['id']);
    }));

});
