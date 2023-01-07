import { Query } from '@services/generic/query';
import { StudentTest } from '@services/modules/examination/models/student-test';
import { RemoveDuplicateMarksComponent } from './remove-duplicate-marks.component';

export class RemoveDuplicateMarksServiceAdapter {
    vm: RemoveDuplicateMarksComponent;

    constructor() {}

    initializeAdapter(vm: RemoveDuplicateMarksComponent): void {
        this.vm = vm;
    }

    //initialize data
    async initializeData() {

        this.vm.isLoading = true;

        let subjectQuery = new Query()
        .getObjectList({subject_app: 'SubjectSecond'});

        let classQuery = new Query()
        .getObjectList({class_app: 'Class'});

        let sectionQuery = new Query()
        .getObjectList({class_app: 'Division'});

        let examinationQuery = new Query()
        .filter({
            parentSchool: this.vm.user.activeSchool.dbId,
            parentSession: this.vm.user.activeSchool.currentSessionDbId,
        })
        .addChildQuery(
            'testsecond',
            new Query()
            .filter({testType: null})
        )
        .addChildQuery(
            'studenttest',
            new Query()
            .filter({testType: null})
            .orderBy('parentSubject','parentStudent','id')
            .addParentQuery(
                'parentStudent',
                new Query()
                .setFields('id','name','fathersName')
                .addChildQuery(
                    'studentSectionList',
                    new Query()
                    .filter({parentSession: this.vm.user.activeSchool.currentSessionDbId})
                )
            )
        )
        .getObjectList({examination_app: 'Examination'});

        [
            this.vm.subjectList, // 0
            this.vm.classList, // 1
            this.vm.sectionList, // 2
            this.vm.examinationList, // 3
        ] = await Promise.all([
            subjectQuery, // 0
            classQuery, // 1
            sectionQuery, // 2
            examinationQuery // 3
        ]);

        // Starts :- Only Keep the duplicated marks with non null parent test
        let studentTestIdToBeDeletedList = [];
        this.vm.examinationList.forEach((examination, examinationIndex) => {
            examination.studenttest.forEach((studentTestOne, studentTestOneIndex) => {
                if (!studentTestOne) {
                    return;
                }
                studentTestOne['marksList'] = [{id: studentTestOne.id, marks: Number(studentTestOne.marksObtained.toString()), absent: studentTestOne.absent, selected: false}];
                examination.studenttest.forEach((studentTestTwo, studentTestTwoIndex) => {
                    if (!studentTestTwo) {
                        return;
                    }
                    if (
                        studentTestOne.parentSubject == studentTestTwo.parentSubject &&
                        studentTestOne.parentStudent == studentTestTwo.parentStudent &&
                        studentTestOne.id != studentTestTwo.id
                    ) {
                        if (
                            studentTestOne.marksObtained == studentTestTwo.marksObtained &&
                            studentTestOne.absent == studentTestTwo.absent
                        ) {
                            studentTestIdToBeDeletedList.push(studentTestTwo.id);
                        } else {
                            studentTestOne.marksList.push({id: studentTestTwo.id, marks: Number(studentTestTwo.marksObtained.toString()), absent: studentTestTwo.absent, selected: false});
                        }
                        delete examination.studenttest[studentTestTwoIndex];
                    }
                });
                if (studentTestOne.marksList.length == 1) {
                    delete examination.studenttest[studentTestOneIndex];
                }
            });
            examination.studenttest = examination.studenttest.filter(item => item != undefined);
            if (examination.studenttest.length == 0) {
                delete this.vm.examinationList[examinationIndex];
            }
        });
        this.vm.examinationList = this.vm.examinationList.filter(item => item != undefined);
        // Ends :- Only Keep the duplicated marks with non null parent test

        let deleteCount = await new Query()
        .filter({id__in: studentTestIdToBeDeletedList})
        .deleteObjectList({examination_app: 'StudentTest'});

        if (deleteCount > 0) {
            alert('Deleted '+deleteCount+' duplicate marks successfully');
        }

        this.vm.isLoading = false;

    }

    async removeDuplicateMarks() {
        
        let studentTestIdToBeDeletedList = [];
        this.vm.examinationList.forEach((examination, examIndex) => {
            examination.studenttest.forEach((studentTest, index) => {
                let filteredMarksList = studentTest.marksList.filter(marks => {
                    return !marks.selected;
                });
                if (filteredMarksList.length == studentTest.marksList.length-1) {
                    studentTestIdToBeDeletedList = studentTestIdToBeDeletedList.concat(
                        filteredMarksList.map(item => item.id)
                    );
                    delete examination.studenttest[index];
                }
            });
            examination.studenttest = examination.studenttest.filter(item => item != undefined);
            if (examination.studenttest.length == 0) {
                delete this.vm.examinationList[examIndex];
            }
        });
        this.vm.examinationList = this.vm.examinationList.filter(item => item != undefined);

        if (studentTestIdToBeDeletedList.length == 0) {
            alert('First, select some marks to keep.');
            return;
        }

        this.vm.isLoading = true;

        let deleteCount = await new Query()
        .filter({id__in: studentTestIdToBeDeletedList})
        .deleteObjectList({examination_app: 'StudentTest'});

        if (deleteCount > 0) {
            alert('Deleted '+deleteCount+' duplicate marks successfully');
        }
        
        this.vm.isLoading = false;

    }

}
