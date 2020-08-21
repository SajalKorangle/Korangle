// import {async, ComponentFixture, fakeAsync, TestBed, tick} from '@angular/core/testing';
//
// import { UpdateProfileComponent} from './update-profile.component';
// import {BasicComponentsModule} from '../../../../basic-components/basic-components.module';
// import {ComponentsModule} from '../../../../components/components.module';
// import {HttpClientTestingModule} from '@angular/common/http/testing';
// import {DataStorage} from '../../../../classes/data-storage';
// import {USER_LIST} from '../../../../../test-data-source/classes/user';
// import {SCHOOL_LIST} from '../../../../../test-data-source/classes/school';
// import {CLASS_LIST} from '../../../../../test-data-source/classes/class';
// import {SECTION_LIST} from '../../../../../test-data-source/classes/division';
// import {StudentService} from '../../../../services/modules/student/student.service';
// import {STUDENT_LIST} from '../../../../../test-data-source/services/modules/students/students';
// import {STUDENT_SECTION_LIST} from '../../../../../test-data-source/services/modules/students/student-section';
// import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
// import {SchoolService} from '../../../../services/modules/school/school.service';
// import {BUS_STOP_LIST} from '../../../../../test-data-source/services/modules/school/models/bus-stop';
//
//
// // class MockSchoolService {
// //     bus_stop = '/bus-stops';
// //
// //     getObjectList(url,data): Promise<any>{
// //         //console.log('-----------------------------------Get Object List Called----------------------------')
// //         //console.log(data['parentSchool']);
// //         if(url == '/bus-stops'){
// //             let busStopList = BUS_STOP_LIST.filter(busStop => {
// //                 return busStop.parentSchool == data['parentSchool'];
// //             });
// //             console.log("Filtered Stops ",busStopList);
// //             return Promise.resolve(busStopList);
// //         }
// //     }
// // }
//
// describe('UpdateProfileComponent', () => {
//     let component: UpdateProfileComponent;
//     let fixture: ComponentFixture<UpdateProfileComponent>;
//
//     beforeEach(async(() => {
//         TestBed.configureTestingModule({
//             declarations: [ UpdateProfileComponent ],
//             imports: [ BasicComponentsModule, ComponentsModule, HttpClientTestingModule, BrowserAnimationsModule ],
//             providers: [ StudentService, SchoolService ],
//         }).overrideComponent(UpdateProfileComponent, {
//             set: {
//                 providers: [
//                     //{provide: SchoolService, useClass: MockSchoolService}
//                 ]
//             }
//         }).compileComponents();
//         DataStorage.getInstance().setUser(USER_LIST[0]);
//         DataStorage.getInstance().getUser().schoolList.push(SCHOOL_LIST[1]);
//         DataStorage.getInstance().getUser().activeSchool = SCHOOL_LIST[1];
//     }));
//
//     beforeEach(() => {
//         fixture = TestBed.createComponent(UpdateProfileComponent);
//         component = fixture.componentInstance;
//         fixture.detectChanges();
//     });
//
//     it('Testing Student Input', fakeAsync(() => {
//         component.busStopList = BUS_STOP_LIST.filter(busStop => {
//             return busStop.parentSchool == SCHOOL_LIST[1].dbId;
//         });
//         fixture.detectChanges();
//         spyOn(TestBed.get(StudentService),'getObject').and.callFake(function () {
//             if(arguments[0]=='/students'){
//                 return Promise.resolve(STUDENT_LIST[0]);
//             }
//         });
//         component.handleDetailsFromParentStudentFilter({'classList' : CLASS_LIST, 'sectionList': SECTION_LIST});
//         component.handleStudentListSelection( [STUDENT_LIST,STUDENT_SECTION_LIST]);
//         tick();
//         expect(component.selectedStudentSection.id).toBe(STUDENT_SECTION_LIST[0].id);
//         expect(component.selectedStudent.id).toBe(STUDENT_LIST[0].id);
//     }));
//
// });
