
import { GeneratePatrakComponent } from './generate-patrak.component';
import {ATTENDANCE_STATUS_LIST} from '../../../../attendance/classes/constants';

export class GeneratePatrakServiceAdapter {

    vm: GeneratePatrakComponent;

    constructor() {}

    // Data
    reportCardMapping: any;
    classList: any;
    // sectionList: any;
    studentList: any;
    examinationList: any;
    subjectList: any;
    extraFieldList: any;
    extraSubFieldList: any;

    classSubjectList: any;
    studentSubjectList: any;
    classTestList: any;
    studentTestList: any;
    studentExtraSubFieldList: any;
    studentAttendanceList: any;


    initializeAdapter(vm: GeneratePatrakComponent): void {
        this.vm = vm;
    }

    copyObject(object: any): any {
        let tempObject = {};
        Object.keys(object).forEach(key => {
            tempObject[key] = object[key];
        });
        return tempObject;
    }

    //initialize data
    initializeData(): void {
        this.vm.isLoading = true;

        const request_mp_board_report_card_mapping_data = {
            'parentSession': this.vm.user.activeSchool.currentSessionDbId,
            'parentSchool': this.vm.user.activeSchool.dbId,
        };

        this.vm.examinationOldService.getMpBoardReportCardMapping(request_mp_board_report_card_mapping_data, this.vm.user.jwt).then(value => {

            if (value == null) {

                this.vm.reportCardMapping = null;
                this.vm.isLoading = false;

            } else {

                this.reportCardMapping = value;
                this.vm.reportCardMapping = value;

                const student_full_profile_request_data = {
                    schoolDbId: this.vm.user.activeSchool.dbId,
                    sessionDbId: this.vm.user.activeSchool.currentSessionDbId,
                };

                const request_examination_data = {
                    'id__in': this.getExaminationIdList(),
                };

                Promise.all([
                    this.vm.classService.getClassList(this.vm.user.jwt),
                    // this.vm.classOldService.getSectionList(this.vm.user.jwt),
                    this.vm.studentService.getStudentFullProfileList(student_full_profile_request_data, this.vm.user.jwt),
                    this.vm.examinationService.getObjectList(this.vm.examinationService.examination,request_examination_data),
                    this.vm.subjectService.getSubjectList(this.vm.user.jwt),
                    this.vm.subjectService.getExtraFieldList({}, this.vm.user.jwt),
                    this.vm.subjectService.getExtraSubFieldList({}, this.vm.user.jwt),
                ]).then(value2 => {
                    console.log(value2);
                    this.classList = value2[0];
                    // this.sectionList = value2[1];
                    this.studentList = value2[1];
                    this.examinationList = value2[2];
                    this.subjectList = value2[3];
                    this.extraFieldList = value2[4];
                    this.extraSubFieldList = value2[5];

                    this.vm.subjectList = value2[3];
                    this.populateClassStudentList();
                    this.vm.isLoading = false;
                }, error => {
                    this.vm.isLoading = false;
                });

            }

        }, error => {
            this.vm.isLoading = false;
        });

    }

    getExaminationIdList(): any {
        let id_list = [];

        if (id_list.indexOf(this.reportCardMapping.parentExaminationJuly) == -1) {
            id_list.push(this.reportCardMapping.parentExaminationJuly);
        }

        if (id_list.indexOf(this.reportCardMapping.parentExaminationAugust) == -1) {
            id_list.push(this.reportCardMapping.parentExaminationAugust);
        }

        if (id_list.indexOf(this.reportCardMapping.parentExaminationSeptember) == -1) {
            id_list.push(this.reportCardMapping.parentExaminationSeptember);
        }

        if (id_list.indexOf(this.reportCardMapping.parentExaminationOctober) == -1) {
            id_list.push(this.reportCardMapping.parentExaminationOctober);
        }

        if (id_list.indexOf(this.reportCardMapping.parentExaminationHalfYearly) == -1) {
            id_list.push(this.reportCardMapping.parentExaminationHalfYearly);
        }

        if (id_list.indexOf(this.reportCardMapping.parentExaminationDecember) == -1) {
            id_list.push(this.reportCardMapping.parentExaminationDecember);
        }

        if (id_list.indexOf(this.reportCardMapping.parentExaminationJanuary) == -1) {
            id_list.push(this.reportCardMapping.parentExaminationJanuary);
        }

        if (id_list.indexOf(this.reportCardMapping.parentExaminationFebruary) == -1) {
            id_list.push(this.reportCardMapping.parentExaminationFebruary);
        }

        if (id_list.indexOf(this.reportCardMapping.parentExaminationFinal) == -1) {
            id_list.push(this.reportCardMapping.parentExaminationFinal);
        }

        if (id_list.indexOf(this.reportCardMapping.parentExaminationProject) == -1) {
            id_list.push(this.reportCardMapping.parentExaminationProject);
        }

        return id_list;
    }

    populateClassStudentList(): void {
        this.vm.classStudentList = [];
        this.classList.forEach(classs => {
            let tempClass = this.copyObject(classs);
            tempClass['studentList'] = [];
            this.studentList.filter(student => {
                return student.parentTransferCertificate === null;
            }).forEach(student => {
                if (student.classDbId === classs.dbId) {
                    tempClass['studentList'].push(student);
                }
            });
            if (tempClass['studentList'].length > 0) {
                this.vm.classStudentList.push(tempClass);
            }
        });
        if (this.vm.classStudentList.length > 0) {
            this.vm.selectedClass = this.vm.classStudentList[0];
        }
    }


    // Get Class Patrak Details
    getClassPatrakDetails(): void {

        let request_class_subject_data = {
            'subjectList': [],
            'schoolList': [this.vm.user.activeSchool.dbId],
            'employeeList': [],
            'classList': [this.vm.selectedClass.dbId],
            'sectionList': [1],
            'sessionList': [this.vm.user.activeSchool.currentSessionDbId],
            'mainSubject': [],
            'onlyGrade': [],
        };

        this.vm.isLoading = true;

        this.vm.subjectService.getClassSubjectList(request_class_subject_data, this.vm.user.jwt).then(valueOne => {

            // console.log(valueOne);

            if (valueOne.length == 0) {
                alert('No subjects added in class');
                this.vm.isLoading = false;
                return;
            }

            this.classSubjectList = valueOne.filter(a => {return a.mainSubject;}).sort((a,b) => {return a.orderNumber-b.orderNumber;});

            this.vm.classSubjectList = this.classSubjectList;

            let request_student_subject_data = {
                'studentList': this.vm.selectedClass.studentList.map(a => a.dbId),
                'subjectList': this.classSubjectList.map(a => a.parentSubject),
                'sessionList': [this.vm.user.activeSchool.currentSessionDbId],
            };

            let request_class_test_data = {
                /*'examinationId': this.vm.selectedExamination.id,
                'classId': this.vm.selectedExamination.selectedClass.dbId,
                'sectionId': this.vm.selectedExamination.selectedClass.selectedSection.id,*/
                'parentExamination__in': this.getExaminationIdList(),
                'parentClass__in': this.vm.selectedClass.dbId,
                'parentDivision__in': 1,
                'parentSubject__in':this.classSubjectList.map(a => a.parentSubject),
            };

            /*let request_class_test_data = {
                'examinationList': this.getExaminationIdList(),
                'subjectList': this.classSubjectList.map(a => a.parentSubject),
                'classList': [this.vm.selectedClass.dbId],
                'sectionList': [1],
                'startTimeList': [],
                'endTimeList': [],
                'testTypeList': [],
                'maximumMarksList': [],
            };*/

            let request_student_test_data = {
                'studentList': this.vm.selectedClass.studentList.map(a => a.dbId),
                'examinationList': this.getExaminationIdList(),
                'subjectList': this.classSubjectList.map(a => a.parentSubject),
                'testTypeList': [],
                'marksObtainedList': [],
            };

            let request_student_extra_sub_field_data = {
                'studentList': this.vm.selectedClass.studentList.map(a => a.dbId).join(),
                'examinationList': this.getExaminationIdList().join(),
            };

            let request_array = [];
            request_array.push(this.vm.subjectService.getStudentSubjectList(request_student_subject_data, this.vm.user.jwt));
            request_array.push(this.vm.examinationService.getObjectList(this.vm.examinationService.test_second,request_class_test_data));
            request_array.push(this.vm.examinationOldService.getStudentTestList(request_student_test_data, this.vm.user.jwt));
            request_array.push(this.vm.examinationOldService.getStudentExtraSubFieldList(request_student_extra_sub_field_data, this.vm.user.jwt));

            // Call attendance data from here
            if (this.vm.reportCardMapping.autoAttendance) {
                switch(this.vm.selectedClass.name) {
                    case 'Play Group':
                    case 'Nursery':
                    case 'L.K.G.':
                    case 'U.K.G.':
                    case 'Class - 1':
                    case 'Class - 2':
                    case 'Class - 3':
                    case 'Class - 4':
                    case 'Class - 5':
                    case 'Class - 6':
                    case 'Class - 7':
                    case 'Class - 8':
                        let data_july = this.getExaminationAttendanceStartEndDate('attendanceJuly');
                        if (data_july != null) {request_array.push(this.vm.attendanceService.getStudentAttendanceList(data_july, this.vm.user.jwt))};
                        let data_august = this.getExaminationAttendanceStartEndDate('attendanceAugust');
                        if (data_august != null) {request_array.push(this.vm.attendanceService.getStudentAttendanceList(data_august, this.vm.user.jwt))};
                        let data_september = this.getExaminationAttendanceStartEndDate('attendanceSeptember');
                        if (data_september != null) {request_array.push(this.vm.attendanceService.getStudentAttendanceList(data_september, this.vm.user.jwt))};
                        let data_october = this.getExaminationAttendanceStartEndDate('attendanceOctober');
                        if (data_october != null) {request_array.push(this.vm.attendanceService.getStudentAttendanceList(data_october, this.vm.user.jwt))};
                        let data_half_yearly = this.getExaminationAttendanceStartEndDate('attendanceHalfYearly');
                        if (data_half_yearly != null) {request_array.push(this.vm.attendanceService.getStudentAttendanceList(data_half_yearly, this.vm.user.jwt))};
                        let data_december = this.getExaminationAttendanceStartEndDate('attendanceDecember');
                        if (data_december != null) {request_array.push(this.vm.attendanceService.getStudentAttendanceList(data_december, this.vm.user.jwt))};
                        let data_january = this.getExaminationAttendanceStartEndDate('attendanceJanuary');
                        if (data_january != null) {request_array.push(this.vm.attendanceService.getStudentAttendanceList(data_january, this.vm.user.jwt))};
                        let data_february = this.getExaminationAttendanceStartEndDate('attendanceFebruary');
                        if (data_february != null) {request_array.push(this.vm.attendanceService.getStudentAttendanceList(data_february, this.vm.user.jwt))};
                        let data_final = this.getExaminationAttendanceStartEndDate('attendanceFinal');
                        if (data_final != null) {request_array.push(this.vm.attendanceService.getStudentAttendanceList(data_final, this.vm.user.jwt))};
                        break;
                    case 'Class - 9':
                    case 'Class - 10':
                    case 'Class - 11':
                    case 'Class - 12':
                        let data_quarterly_high = this.getExaminationAttendanceStartEndDate('attendanceQuarterlyHigh');
                        if (data_quarterly_high != null) {request_array.push(this.vm.attendanceService.getStudentAttendanceList(data_quarterly_high, this.vm.user.jwt))};
                        let data_half_yearly_high = this.getExaminationAttendanceStartEndDate('attendanceHalfYearlyHigh');
                        if (data_half_yearly_high != null) {request_array.push(this.vm.attendanceService.getStudentAttendanceList(data_half_yearly_high, this.vm.user.jwt))};
                        let data_final_high = this.getExaminationAttendanceStartEndDate('attendanceFinalHigh');
                        if (data_final_high != null) {request_array.push(this.vm.attendanceService.getStudentAttendanceList(data_final_high, this.vm.user.jwt))};
                        break;
                }
            }

            Promise.all(request_array).then(valueTwo => {

                // console.log(valueTwo);

                this.studentSubjectList = valueTwo[0];
                this.classTestList = valueTwo[1];
                this.studentTestList = valueTwo[2];
                this.studentExtraSubFieldList = valueTwo[3];
                this.studentAttendanceList = [];
                if (valueTwo.length > 4) {
                    valueTwo.slice(4, valueTwo.length).forEach(item => {
                        this.studentAttendanceList = this.studentAttendanceList.concat(item);
                    });
                }
                this.populateIncludeProject();
                this.populateExtraFieldList();
                this.populateStudentFinalReportCard();
                this.vm.downloadClassPatrak();
                this.vm.isLoading = false;
            }, error => {
                this.vm.isLoading = false;
            });

        }, error => {
            this.vm.isLoading = false;
        });

    }

    populateIncludeProject(): void {
        switch(this.vm.selectedClass.name) {
            case 'Class - 6':
            case 'Class - 7':
            case 'Class - 8':
                this.vm.includeProject = true;
                break;
            default:
                this.vm.includeProject = false;
        }
    }

    getExaminationAttendanceStartEndDate(key: any): any {
        let key1 = key + 'Start';
        let key2 = key + 'End';
        let data = null;
        if (this.vm.reportCardMapping[key1] != null && this.vm.reportCardMapping[key2] != null) {
            data = {
                'studentIdList': this.vm.selectedClass.studentList.map(a => a.dbId).join(),
                'startDate': this.vm.reportCardMapping[key1],
                'endDate': this.vm.reportCardMapping[key2],
            };
        }
        return data;
    }

    populateExtraFieldList(): void {
        this.vm.extraFieldList = this.extraFieldList;
        this.vm.extraFieldList.forEach(extraField => {
            extraField['extraSubFieldList'] = [];
            this.extraSubFieldList.forEach(extraSubField => {
                if (extraSubField.parentExtraField == extraField.id) {
                    extraField['extraSubFieldList'].push(this.copyObject(extraSubField));
                }
            });
        });
    }

    populateStudentFinalReportCard(): void {
        this.vm.studentFinalReportCardList = this.vm.selectedClass.studentList.sort((a,b) => {
            if (a.category == b.category) {
                return 0;
            }
            if (a.category == 'SC') {
                return -1;
            } else if (a.category == 'ST'
                && b.category != 'SC') {
                return -1;
            } else if (a.category == 'OBC'
                && b.category != 'SC' && b.category != 'ST') {
                return -1;
            } else if (a.category == 'Gen.'
                && b.category != 'SC' && b.category != 'ST' && b.category != 'OBC') {
                return -1;
            } else if (a.category == null
                && b.category != 'SC' && b.category != 'ST' && b.category != 'OBC' && b.category != 'Gen.') {
                return -1;
            }
            return 1;
        });
        this.vm.studentFinalReportCardList.forEach(student => {
            student['mainSubjectList'] = this.getStudentSubjectList(student.dbId);
            Object.keys(this.vm.reportCardMapping).forEach(key => {
                if (key.match('parentExamination')) {
                    student[key] = {};
                    let maximumMarks = 10;
                    switch(key) {
                        case 'parentExaminationHalfYearly':
                            maximumMarks = 50;
                            break;
                        case 'parentExaminationFinal':
                            maximumMarks = 100;
                            break;
                        case 'parentExaminationProject':
                            maximumMarks = 20;
                            break;
                    }
                    student[key]['maximumMarks'] = maximumMarks;
                    student[key]['mainSubjectMarksList'] = [];
                    student['mainSubjectList'].forEach(item => {
                        student[key]['mainSubjectMarksList']
                            .push(this.getStudentSubjectMarks(student.dbId, item.parentSubject, this.vm.reportCardMapping[key], maximumMarks));
                    });
                    student[key]['extraSubFieldMarksList'] = [];
                    if (key != 'parentExaminationProject') {
                        this.vm.extraFieldList.forEach(extraField => {
                            extraField['extraSubFieldList'].forEach(extraSubField => {
                                student[key]['extraSubFieldMarksList']
                                    .push(this.getStudentExtraSubFieldMarks(student.dbId, extraSubField.id, this.vm.reportCardMapping[key]));
                            });
                        });
                    }
                    if (key == 'parentExaminationProject' || !this.vm.reportCardMapping.autoAttendance) {
                        student[key]['attendanceData'] = {
                            'attendance': 0,
                            'workingDays': 0,
                        };
                    } else {
                        student[key]['attendanceData'] = this.getStudentAttendanceExamData(student.dbId, key);
                    }
                }
            });
        });
    }

    getStudentSubjectList(studentId: any): any {
        let subjectList = [];
        this.classSubjectList.forEach(item => {
            subjectList.push(item);
        });
        return subjectList;
    }

    getStudentSubjectMarks(studentId: any, subjectId: any, examinationId: any, maximumMarks: any): any {
        let classMarks = 0;
        let studentMarks = 0;
        this.classTestList.forEach(item => {
            if (item.parentSubject == subjectId && item.parentExamination == examinationId) {
                classMarks += parseFloat(item.maximumMarks);
            }
        });
        this.studentTestList.forEach(item => {
            if (item.parentStudent == studentId
                && item.parentSubject == subjectId
                && item.parentExamination == examinationId) {
                studentMarks += parseFloat(item.marksObtained);
            }
        });
        if (classMarks==0) {classMarks = 1};
        return (studentMarks*maximumMarks)/classMarks;
    }

    getStudentExtraSubFieldMarks(studentId: any, extraSubFieldId: any, examinationId: any): any {
        let studentMarks = 0;
        this.studentExtraSubFieldList.every(item => {
            if (item.parentStudent == studentId
                && item.parentExtraSubField == extraSubFieldId
                && item.parentExamination == examinationId) {
                studentMarks = parseFloat(item.marksObtained);
                return false;
            }
            return true;
        });
        return studentMarks;
    }

    getStudentAttendanceExamData(studentId: any, key: any): any {
        let result = {
            'attendance': 0,
            'workingDays': 0,
        };
        let key1 = 'attendance'+key.substr(17,key.length)+'Start';
        let key2 = 'attendance'+key.substr(17,key.length)+'End';
        if (this.vm.reportCardMapping[key1] != null && this.vm.reportCardMapping[key2] != null) {
            let startDate = new Date(this.vm.reportCardMapping[key1]);
            let endDate = new Date(this.vm.reportCardMapping[key2]);
            this.studentAttendanceList.filter(item => {
                let tempDate = new Date(item.dateOfAttendance);
                if (item.parentStudent != studentId
                    || tempDate < startDate
                    || tempDate > endDate) {
                    return false;
                }
                return true;
            }).forEach(studentAttendance => {
                if (studentAttendance.status === ATTENDANCE_STATUS_LIST[0]) {
                    result['attendance'] += 1;
                    result['workingDays'] += 1;
                } else if (studentAttendance.status === ATTENDANCE_STATUS_LIST[1]) {
                    result['workingDays'] += 1;
                }
            });
        }
        return result;
    }

}
