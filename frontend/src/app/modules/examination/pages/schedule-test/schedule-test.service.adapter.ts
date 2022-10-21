import { TEST_TYPE_LIST } from '../../../../classes/constants/test-type';
import { ScheduleTestComponent } from './schedule-test.component';

export class ScheduleTestServiceAdapter {
    vm: ScheduleTestComponent;

    test_type_list = TEST_TYPE_LIST;

    examTypeList: any;

    classListForTest: any;

    sectionListForTest: any;

    commonSubjectList: Array<{
        subjectId: any;
        subjectName: any;
        classList: Array<{
            className: any;
            classId: any;
        }>;
        sectionList: Array<{
            sectionName: any;
            sectionId: any;
        }>;
    }>;

    constructor() {}

    // Data

    classList: any;

    sectionList: any;

    subjectList: any;

    testList: any;

    classSubjectList: any;

    student_mini_profile_list: any;

    initializeAdapter(vm: ScheduleTestComponent): void {
        this.vm = vm;
    }

    //initialize data
    initializeData(): void {
        this.vm.isInitialLoading = true;

        let request_examination_data = {
            parentSession: this.vm.user.activeSchool.currentSessionDbId,
            parentSchool: this.vm.user.activeSchool.dbId,
        };

        let request_class_section_subject_data = {
            parentSession: this.vm.user.activeSchool.currentSessionDbId,
            parentSchool: this.vm.user.activeSchool.dbId,
        };

        Promise.all([
            this.vm.examinationService.getObjectList(this.vm.examinationService.examination, request_examination_data),
            this.vm.classService.getObjectList(this.vm.classService.classs, {}),
            this.vm.classService.getObjectList(this.vm.classService.division, {}),
            this.vm.subjectNewService.getObjectList(this.vm.subjectNewService.subject, {}),
            this.vm.subjectNewService.getObjectList(this.vm.subjectNewService.class_subject, request_class_section_subject_data),
        ]).then(
            (value) => {
                this.vm.examinationList = value[0];

                this.classList = value[1];
                this.sectionList = value[2];
                this.subjectList = value[3];

                this.examTypeList = value[4];
                this.classSubjectList = value[4];

                this.vm.classSectionSubjectList = [];

                value[4].forEach((item) => {
                    var classIndex = this.vm.classSectionSubjectList.findIndex((data) => data.classId === item.parentClass);
                    var sectionIndex = -1,
                        subjectIndex = -1;
                    if (classIndex != -1) {
                        sectionIndex = this.vm.classSectionSubjectList[classIndex].sectionList.findIndex(
                            (section) => section.sectionId === item.parentDivision
                        );

                        if (sectionIndex != -1) {
                            subjectIndex = this.vm.classSectionSubjectList[classIndex].sectionList[sectionIndex].subjectList.findIndex(
                                (subject) => subject.subjectId === item.parentSubject
                            );
                        }
                    }

                    let tempSubject = {
                        subjectName: this.getSubjectName(item.parentSubject),
                        subjectId: item.parentSubject,
                    };

                    let tempSubjectList = [];
                    tempSubjectList.push(tempSubject);

                    let tempSection = {
                        sectionName: this.getSectionName(item.parentDivision),
                        sectionId: item.parentDivision,
                        selected: false,
                        subjectList: tempSubjectList,
                    };

                    let tempSectionList = [];
                    tempSectionList.push(tempSection);

                    let tempClass = {
                        className: this.getClassName(item.parentClass),
                        classId: item.parentClass,
                        sectionList: tempSectionList,
                    };

                    if (classIndex === -1) {
                        this.vm.classSectionSubjectList.push(tempClass);
                    } else if (sectionIndex === -1) {
                        this.vm.classSectionSubjectList[classIndex].sectionList.push(tempSection);
                    } else if (subjectIndex === -1) {
                        this.vm.classSectionSubjectList[classIndex].sectionList[sectionIndex].subjectList.push(tempSubject);
                    }
                });

                //sort the classSection list
                this.classSectionSubjectListSort();
                this.vm.subjectList = this.subjectList;
                this.vm.isInitialLoading = false;
            },
            (error) => {
                this.vm.isInitialLoading = false;
            }
        );
    }

    //Get Test and Subject Details New implemented to ready the data and check if test list can be fetched or not
    getTestAndSubjectDetailsNew(): void {
        this.vm.isLoading = true;
        this.makeDataReadyForGet();

        if (this.vm.showSelectedClassAndSection.length === 0) {
            alert('Please select any class and section');
            this.vm.isLoading = false;
            this.vm.showTestDetails = false;
            return;
        }

        if (this.vm.selectedExamination === undefined) {
            alert('Please select any Exam');
            this.vm.isLoading = false;
            this.vm.showTestDetails = false;
            return;
        }

        let totalNumberOfListRequired = this.classListForTest.length;

        let request_subject_data = {
            parentSession: [this.vm.user.activeSchool.currentSessionDbId],
            parentSchool: [this.vm.user.activeSchool.dbId],
            parentClass__in: this.classListForTest.join(','),
            parentDivision__in: this.sectionListForTest.join(','),
        };

        Promise.all([this.vm.subjectNewService.getObjectList(this.vm.subjectNewService.class_subject, request_subject_data)]).then(
            (value) => {
                this.commonSubjectList = [];

                value[0].forEach((item) => {
                    for (let i = 0; i < this.classListForTest.length; i++) {
                        if (this.classListForTest[i] === item.parentClass && this.sectionListForTest[i] === item.parentDivision) {
                            var subIdx = this.commonSubjectList.findIndex((sub) => sub.subjectId === item.parentSubject);

                            let tempClass = {
                                className: this.getClassName(item.parentClass),
                                classId: item.parentClass,
                            };

                            let tempSection = {
                                sectionName: this.getSectionName(item.parentDivision),
                                sectionId: item.parentDivision,
                            };

                            let tempClassList = [];
                            tempClassList.push(tempClass);
                            let tempSectionList = [];
                            tempSectionList.push(tempSection);

                            if (subIdx != -1) {
                                this.commonSubjectList[subIdx].classList.push(tempClass);
                                this.commonSubjectList[subIdx].sectionList.push(tempSection);
                            } else {
                                let tempSub = {
                                    subjectName: this.getSubjectName(item.parentSubject),
                                    subjectId: item.parentSubject,
                                    classList: tempClassList,
                                    sectionList: tempSectionList,
                                };
                                this.commonSubjectList.push(tempSub);
                            }
                        }
                    }
                });
                this.populateSubjectList();

                var findOne = this.commonSubjectList.findIndex((item) => item.classList.length != totalNumberOfListRequired);

                if (findOne === -1) {
                    this.vm.dataCanBeFetched = true;
                    this.getTestAndSubjectDetails();
                } else {
                    this.vm.dataCanBeFetched = false;
                    this.vm.isLoading = false;
                    this.vm.showTestDetails = false;
                    return;
                }
            },
            (error) => {
                this.vm.isLoading = false;
            }
        );
    }

    //Get Test And Subject Details
    getTestAndSubjectDetails(): void {
        this.vm.isLoading = true;

        let request_test_data_list = {
            parentExamination: this.vm.selectedExamination,
            parentClass__in: this.classListForTest.join(','),
            parentDivision__in: this.sectionListForTest.join(','),
        };

        Promise.all([
            //fetch test list
            this.vm.examinationService.getObjectList(this.vm.examinationService.test_second, request_test_data_list),
        ]).then(
            (value) => {
                //test list obtained...

                this.vm.newTestList = [];
                value[0].forEach((test) => {
                    for (let i = 0; i < this.classListForTest.length; i++) {
                        if (this.classListForTest[i] === test.parentClass && this.sectionListForTest[i] === test.parentDivision) {
                            var subIdx = this.vm.newTestList.findIndex(
                                (sub) =>
                                    sub.subjectId === test.parentSubject &&
                                    sub.testType === test.testType &&
                                    sub.maximumMarks === test.maximumMarks &&
                                    this.vm.formatDate(sub.date, '') === this.vm.formatDate(this.vm.getTestDate(test), '') &&
                                    sub.startTime === this.extractTime(test.startTime) &&
                                    sub.endTime === this.extractTime(test.endTime)

                                // check for same date and start & end time also
                            );
                            var classIdx = -1,
                                sectionIdx = -1;

                            if (subIdx != -1) {
                                classIdx = this.vm.newTestList[subIdx].classList.findIndex((cl) => cl.classId === test.parentClass);

                                if (classIdx != -1) {
                                    sectionIdx = this.vm.newTestList[subIdx].classList[classIdx].sectionList.findIndex(
                                        (sec) => sec.sectionId === test.parentDivision
                                    );
                                }
                            }

                            let tempSection = {
                                sectionName: this.getSectionName(test.parentDivision),
                                sectionId: test.parentDivision,
                                testId: test.id,
                            };

                            let tempSectionList = [];
                            tempSectionList.push(tempSection);

                            let tempClass = {
                                className: this.getClassName(test.parentClass),
                                classId: test.parentClass,
                                sectionList: tempSectionList,
                            };
                            let tempClassList = [];
                            tempClassList.push(tempClass);

                            let tempSubject = {
                                parentExamination: test.parentExamination,
                                deleted: false,
                                subjectId: test.parentSubject,
                                subjectName: this.getSubjectName(test.parentSubject),
                                testType: test.testType,
                                startTime: this.extractTime(test.startTime),
                                newStartTime: this.extractTime(test.startTime),
                                endTime: this.extractTime(test.endTime),
                                newEndTime: this.extractTime(test.endTime),

                                date: this.vm.getTestDate(test),

                                newDate: this.vm.getTestDate(test),
                                maximumMarks: test.maximumMarks,
                                classList: tempClassList,
                            };

                            if (subIdx === -1) {
                                this.vm.newTestList.push(tempSubject);
                            } else if (classIdx === -1) {
                                this.vm.newTestList[subIdx].classList.push(tempClass);
                            } else if (sectionIdx === -1) {
                                this.vm.newTestList[subIdx].classList[classIdx].sectionList.push(tempSection);
                            }
                        }
                    }
                });

                this.vm.fetchedListLength = this.vm.newTestList.length;
                this.vm.isLoading = false;
                this.vm.showTestDetails = true;
                this.vm.handleUpdate();
            },
            (error) => {
                this.vm.isLoading = false;
            }
        );
    }

    populateSubjectList(): void {
        this.vm.subjectList = [];
        this.commonSubjectList.forEach((item) => {
            let tempSubject = {
                id: item.subjectId,
                name: item.subjectName,
            };
            this.vm.subjectList.push(tempSubject);
        });
    }

    getDateTime(selectedDate: any, selectedTime: any): any {
        return selectedDate + 'T' + selectedTime + ':00+05:30';
    }

    extractTime(dateStr: any): any {
        let d = new Date(dateStr);

        let hour = (d.getHours() < 10 ? '0' : '') + d.getHours();
        let minute = '' + d.getMinutes();

        return hour + ':' + minute;
    }

    getSubjectName(subjectId: any): any {
        let result = '';
        this.subjectList.every((subject) => {
            if (subject.id === subjectId) {
                result = subject.name;
                return false;
            }
            return true;
        });
        return result;
    }

    getClassName(classId: any): any {
        let result = '';
        this.classList.every((item) => {
            if (item.id === classId) {
                result = item.name;
                return false;
            }
            return true;
        });
        return result;
    }

    getSectionName(sectionId: any): any {
        let result = '';
        this.sectionList.every((item) => {
            if (item.id === sectionId) {
                result = item.name;
                return false;
            }
            return true;
        });
        return result;
    }

    //Update Test List New
    updateTestNew(): any {
        this.vm.isLoading = true;
        let promises = [];
        //Update the test list if any value changed in any of the test from test list
        this.vm.newTestList.forEach((test) => {
            test.classList.forEach((cl) => {
                cl.sectionList.forEach((sec) => {
                    let data = {
                        id: sec.testId,
                        parentExamination: test.parentExamination,
                        parentClass: cl.classId,
                        parentDivision: sec.sectionId,
                        parentSubject: test.subjectId,
                        startTime: this.vm.formatDate(test.newDate, '') + 'T' + test.newStartTime + ':00+05:30',
                        endTime: this.vm.formatDate(test.newDate, '') + 'T' + test.newEndTime + ':00+05:30',
                        testType: test.testType,
                        maximumMarks: test.maximumMarks,
                    };

                    //if deleted
                    if (test.deleted) {
                        promises.push(this.vm.examinationService.deleteObject(this.vm.examinationService.test_second, data));
                    }

                    //if updated
                    else if (data.startTime != test.startTime || data.endTime != test.endTime) {
                        promises.push(this.vm.examinationService.updateObject(this.vm.examinationService.test_second, data));
                    }
                });
            });
        });
        return promises;
    }

    UpdateHelper() {
        let promises = this.updateTestNew();
        Promise.all(promises).then(
            (value) => {
                alert('Test/s scheduled successfully');
                this.getTestAndSubjectDetails();
                this.vm.handleUpdate();
                this.vm.isLoading = false;
            },
            (error) => {
                this.vm.isLoading = false;
            }
        );
    }

    //Sort the nested list
    classSectionSubjectListSort() {
        this.vm.classSectionSubjectList.forEach((cl) => {
            cl.sectionList.sort(function (a, b) {
                return a.sectionId - b.sectionId;
            });
        });

        this.vm.classSectionSubjectList.sort(function (a, b) {
            return a.classId - b.classId;
        });
    }

    //Store the selected  Class and Section list to get the test list
    makeDataReadyForGet(): void {
        this.classListForTest = [];
        this.sectionListForTest = [];
        this.vm.classSectionSubjectList.forEach((cl) => {
            cl.sectionList.forEach((sec) => {
                if (sec.selected) {
                    this.classListForTest.push(cl.classId);
                    this.sectionListForTest.push(sec.sectionId);
                }
            });
        });

        this.vm.showSelectedClassAndSection = [];
        for (let i = 0; i < this.classListForTest.length; i++) {
            this.vm.showSelectedClassAndSection.push({
                className: this.getClassName(this.classListForTest[i]),
                sectionName: this.getSectionName(this.sectionListForTest[i]),
            });
        }
    }
}
