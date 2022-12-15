import { GenerateFinalReportComponent } from './generate-final-report.component';
import { ATTENDANCE_STATUS_LIST } from '../../../../attendance/classes/constants';

export class GenerateFinalReportServiceAdapter {
    vm: GenerateFinalReportComponent;

    constructor() {}

    // Data
    reportCardMapping: any;
    classList: any;
    sectionList: any;
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
    studentCCEMarksList: any;
    studentAttendanceList: any;

    studentRemarksList: any;

    initializeAdapter(vm: GenerateFinalReportComponent): void {
        this.vm = vm;
    }

    copyObject(object: any): any {
        let tempObject = {};
        Object.keys(object).forEach((key) => {
            tempObject[key] = object[key];
        });
        return tempObject;
    }

    //initialize data
    initializeData(): void {
        this.vm.isLoading = true;

        const request_mp_board_report_card_mapping_data = {
            parentSession: this.vm.user.activeSchool.currentSessionDbId,
            parentSchool: this.vm.user.activeSchool.dbId,
        };

        this.vm.examinationOldService.getMpBoardReportCardMapping(request_mp_board_report_card_mapping_data, this.vm.user.jwt).then(
            (value) => {
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
                        id__in: this.getExaminationIdList(),
                    };

                    const teacher_signature_data = {
                        parentSchool: this.vm.user.activeSchool.dbId,
                    };

                    console.log(request_examination_data);

                    Promise.all([
                        this.vm.genericService.getObjectList({class_app: 'Class'}, {}), // 0
                        this.vm.genericService.getObjectList({class_app: 'Division'}, {}), // 1
                        this.vm.studentService.getStudentFullProfileList(student_full_profile_request_data, this.vm.user.jwt), // 2
                        this.vm.examinationService.getObjectList(this.vm.examinationService.examination, request_examination_data), // 3
                        this.vm.subjectService.getSubjectList(this.vm.user.jwt), // 4
                        this.vm.subjectService.getExtraFieldList({}, this.vm.user.jwt), // 5
                        this.vm.subjectService.getExtraSubFieldList({}, this.vm.user.jwt), // 6
                        this.vm.schoolService.getObjectList(this.vm.schoolService.board, {}), // 7
                        this.vm.classService.getObjectList(this.vm.classService.class_teacher_signature, teacher_signature_data), // 8
                        this.vm.genericService.getObjectList({school_app: 'Session'}, {}), // 9
                    ]).then(
                        (value2) => {
                            this.classList = value2[0];
                            this.sectionList = value2[1];
                            this.studentList = value2[2];
                            this.examinationList = value2[3];
                            this.subjectList = value2[4];
                            this.extraFieldList = value2[5];
                            this.extraSubFieldList = value2[6];
                            this.vm.boardList = value2[7];
                            this.vm.classTeacherSignatureList = value2[8];
                            this.vm.sessionList = value2[9];

                            this.vm.subjectList = value2[4];
                            this.populateClassSectionStudentList();
                            this.vm.isLoading = false;
                        },
                        (error) => {
                            this.vm.isLoading = false;
                        }
                    );
                }
            },
            (error) => {
                this.vm.isLoading = false;
            }
        );
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

        if (
            this.reportCardMapping.parentExaminationQuarterlyHigh &&
            id_list.indexOf(this.reportCardMapping.parentExaminationQuarterlyHigh) == -1
        ) {
            id_list.push(this.reportCardMapping.parentExaminationQuarterlyHigh);
        }

        if (
            this.reportCardMapping.parentExaminationHalfYearlyHigh &&
            id_list.indexOf(this.reportCardMapping.parentExaminationHalfYearlyHigh) == -1
        ) {
            id_list.push(this.reportCardMapping.parentExaminationHalfYearlyHigh);
        }

        if (this.reportCardMapping.parentExaminationFinalHigh && id_list.indexOf(this.reportCardMapping.parentExaminationFinalHigh) == -1) {
            id_list.push(this.reportCardMapping.parentExaminationFinalHigh);
        }

        return id_list;
    }

    populateClassSectionStudentList(): void {
        this.vm.classSectionStudentList = [];
        this.classList.forEach((classs) => {
            let tempClass = this.copyObject(classs);
            tempClass['sectionList'] = [];
            this.sectionList.forEach((section) => {
                let tempSection = this.copyObject(section);
                tempSection['studentList'] = [];
                tempSection['selected'] = false;
                this.studentList
                    .filter((student) => {
                        return student.parentTransferCertificate === null;
                    })
                    .forEach((student) => {
                        if (student.classDbId === classs.id && student.sectionDbId === section.id) {
                            student.selected = false;
                            tempSection['studentList'].push(student);
                        }
                    });
                if (tempSection['studentList'].length > 0) {
                    tempClass['sectionList'].push(tempSection);
                }
            });
            if (tempClass['sectionList'].length > 0) {
                this.vm.classSectionStudentList.push(tempClass);
            }
        });
    }

    // Get Student Final Report
    getStudentFinalReport(): void {
        if (this.vm.getSelectedStudentNumber() === 0) {
            alert('Student needs to be selected before generating report');
            return;
        }

        let selectedClassSection = this.vm.getSelectedClassSection();

        let request_class_subject_data = {
            subjectList: [],
            schoolList: [this.vm.user.activeSchool.dbId],
            employeeList: [],
            classList: [selectedClassSection['classDbId']],
            sectionList: [selectedClassSection['sectionDbId']],
            sessionList: [this.vm.user.activeSchool.currentSessionDbId],
            mainSubject: [],
            onlyGrade: [],
        };

        this.vm.isLoading = true;

        this.vm.subjectService.getClassSubjectList(request_class_subject_data, this.vm.user.jwt).then(
            (valueOne) => {
                if (valueOne.length == 0) {
                    alert('No subjects added in class');
                    return;
                }

                this.classSubjectList = valueOne;

                let request_student_subject_data = {
                    studentList: this.vm.filteredStudentList
                        .filter((student) => {
                            return student.selected;
                        })
                        .map((a) => a.dbId),
                    subjectList: valueOne.map((a) => a.parentSubject),
                    sessionList: [this.vm.user.activeSchool.currentSessionDbId],
                };

                let request_class_test_data = {
                    parentExamination__in: this.getExaminationIdList(),
                    parentClass: selectedClassSection['classDbId'],
                    parentDivision: selectedClassSection['sectionDbId'],
                    parentSubject: valueOne.map((a) => a.parentSubject),
                };

                let request_student_test_data = {
                    studentList: this.vm.filteredStudentList
                        .filter((student) => {
                            return student.selected;
                        })
                        .map((a) => a.dbId),
                    examinationList: this.getExaminationIdList(),
                    subjectList: valueOne.map((a) => a.parentSubject),
                    testTypeList: [],
                    marksObtainedList: [],
                };

                let request_student_extra_sub_field_data = {
                    studentList: this.vm.filteredStudentList
                        .filter((student) => {
                            return student.selected;
                        })
                        .map((a) => a.dbId)
                        .join(),
                    examinationList: this.getExaminationIdList().join(),
                };

                let request_student_cce_marks_data = {
                    studentList: this.vm.filteredStudentList
                        .filter((student) => {
                            return student.selected;
                        })
                        .map((a) => a.dbId)
                        .join(),
                    sessionList: [this.vm.user.activeSchool.currentSessionDbId],
                };

                let request_student_remarks_data = {
                    parentStudent__in: this.vm.filteredStudentList
                        .filter((student) => {
                            return student.selected;
                        })
                        .map((a) => a.dbId)
                        .join(),
                    parentSession: [this.vm.user.activeSchool.currentSessionDbId].join(),
                };

                let request_array = [];
                request_array.push(this.vm.subjectService.getStudentSubjectList(request_student_subject_data, this.vm.user.jwt));
                request_array.push(
                    this.vm.examinationService.getObjectList(this.vm.examinationService.test_second, request_class_test_data)
                );
                request_array.push(this.vm.examinationOldService.getStudentTestList(request_student_test_data, this.vm.user.jwt));
                request_array.push(
                    this.vm.examinationOldService.getStudentExtraSubFieldList(request_student_extra_sub_field_data, this.vm.user.jwt)
                );
                request_array.push(this.vm.examinationOldService.getCCEMarksList(request_student_cce_marks_data, this.vm.user.jwt));
                request_array.push(
                    this.vm.reportCardMpBoardService.getObjectList(
                        this.vm.reportCardMpBoardService.student_remark,
                        request_student_remarks_data
                    )
                );

                // Call attendance data from here
                if (this.vm.reportCardMapping.autoAttendance) {
                    switch (selectedClassSection['className']) {
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
                            if (data_july != null) {
                                request_array.push(this.vm.attendanceService.getStudentAttendanceList(data_july, this.vm.user.jwt));
                            }
                            let data_august = this.getExaminationAttendanceStartEndDate('attendanceAugust');
                            if (data_august != null) {
                                request_array.push(this.vm.attendanceService.getStudentAttendanceList(data_august, this.vm.user.jwt));
                            }
                            let data_september = this.getExaminationAttendanceStartEndDate('attendanceSeptember');
                            if (data_september != null) {
                                request_array.push(this.vm.attendanceService.getStudentAttendanceList(data_september, this.vm.user.jwt));
                            }
                            let data_october = this.getExaminationAttendanceStartEndDate('attendanceOctober');
                            if (data_october != null) {
                                request_array.push(this.vm.attendanceService.getStudentAttendanceList(data_october, this.vm.user.jwt));
                            }
                            let data_half_yearly = this.getExaminationAttendanceStartEndDate('attendanceHalfYearly');
                            if (data_half_yearly != null) {
                                request_array.push(this.vm.attendanceService.getStudentAttendanceList(data_half_yearly, this.vm.user.jwt));
                            }
                            let data_december = this.getExaminationAttendanceStartEndDate('attendanceDecember');
                            if (data_december != null) {
                                request_array.push(this.vm.attendanceService.getStudentAttendanceList(data_december, this.vm.user.jwt));
                            }
                            let data_january = this.getExaminationAttendanceStartEndDate('attendanceJanuary');
                            if (data_january != null) {
                                request_array.push(this.vm.attendanceService.getStudentAttendanceList(data_january, this.vm.user.jwt));
                            }
                            let data_february = this.getExaminationAttendanceStartEndDate('attendanceFebruary');
                            if (data_february != null) {
                                request_array.push(this.vm.attendanceService.getStudentAttendanceList(data_february, this.vm.user.jwt));
                            }
                            let data_final = this.getExaminationAttendanceStartEndDate('attendanceFinal');
                            if (data_final != null) {
                                request_array.push(this.vm.attendanceService.getStudentAttendanceList(data_final, this.vm.user.jwt));
                            }
                            break;
                        case 'Class - 9':
                        case 'Class - 10':
                        case 'Class - 11':
                        case 'Class - 12':
                            let data_quarterly_high = this.getExaminationAttendanceStartEndDate('attendanceQuarterlyHigh');
                            if (data_quarterly_high != null) {
                                request_array.push(
                                    this.vm.attendanceService.getStudentAttendanceList(data_quarterly_high, this.vm.user.jwt)
                                );
                            }
                            let data_half_yearly_high = this.getExaminationAttendanceStartEndDate('attendanceHalfYearlyHigh');
                            if (data_half_yearly_high != null) {
                                request_array.push(
                                    this.vm.attendanceService.getStudentAttendanceList(data_half_yearly_high, this.vm.user.jwt)
                                );
                            }
                            let data_final_high = this.getExaminationAttendanceStartEndDate('attendanceFinalHigh');
                            if (data_final_high != null) {
                                request_array.push(this.vm.attendanceService.getStudentAttendanceList(data_final_high, this.vm.user.jwt));
                            }
                            break;
                    }
                }

                Promise.all(request_array).then(
                    (valueTwo) => {
                        this.studentSubjectList = valueTwo[0];
                        this.classTestList = valueTwo[1];
                        this.studentTestList = valueTwo[2];
                        this.studentExtraSubFieldList = valueTwo[3];
                        this.studentCCEMarksList = valueTwo[4];
                        this.studentRemarksList = valueTwo[5];
                        this.studentAttendanceList = [];
                        if (valueTwo.length > 6) {
                            // Earlier 4
                            valueTwo.slice(6, valueTwo.length).forEach((item) => {
                                // Earlier 5
                                this.studentAttendanceList = this.studentAttendanceList.concat(item);
                            });
                        }
                        this.populateExtraFieldList();
                        switch (selectedClassSection['className']) {
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
                                this.populateStudentFinalReportCard();
                                break;
                            case 'Class - 9':
                            case 'Class - 10':
                            case 'Class - 11':
                            case 'Class - 12':
                                this.populateStudentFinalReportCardHigh();
                                break;
                        }
                        const signature = this.vm.classTeacherSignatureList.find((sign) => {
                            return (
                                sign.parentSchool === this.vm.user.activeSchool.dbId &&
                                sign.parentClass === this.vm.getSelectedClassSection().classDbId &&
                                sign.parentDivision === this.vm.getSelectedClassSection().sectionDbId
                            );
                        });
                        if (signature && this.vm.showClassTeacherSignature) {
                            this.vm.currentClassTeacherSignature = signature['signatureImage'];
                        } else {
                            this.vm.currentClassTeacherSignature = null;
                        }
                        this.vm.printStudentFinalReport();
                        this.vm.isLoading = false;
                    },
                    (error) => {
                        this.vm.isLoading = false;
                    }
                );
            },
            (error) => {
                this.vm.isLoading = false;
            }
        );
    }

    getExaminationAttendanceStartEndDate(key: any): any {
        let key1 = key + 'Start';
        let key2 = key + 'End';
        let data = null;
        if (this.vm.reportCardMapping[key1] != null && this.vm.reportCardMapping[key2] != null) {
            data = {
                studentIdList: this.vm.filteredStudentList
                    .filter((student) => {
                        return student.selected;
                    })
                    .map((a) => a.dbId)
                    .join(),
                startDate: this.vm.reportCardMapping[key1],
                endDate: this.vm.reportCardMapping[key2],
            };
        }
        return data;
    }

    populateExtraFieldList(): void {
        this.vm.extraFieldList = this.extraFieldList;
        this.vm.extraFieldList.forEach((extraField) => {
            extraField['extraSubFieldList'] = [];
            this.extraSubFieldList.forEach((extraSubField) => {
                if (extraSubField.parentExtraField == extraField.id) {
                    extraField['extraSubFieldList'].push(this.copyObject(extraSubField));
                }
            });
        });
    }

    populateStudentFinalReportCard(): void {
        this.vm.studentFinalReportCardList = this.vm.filteredStudentList.filter((student) => {
            return student.selected;
        });
        this.vm.studentFinalReportCardList.forEach((student) => {
            student['mainSubjectList'] = this.getStudentMainSubjectList(student.dbId);
            student['extraSubjectList'] = this.getStudentExtraSubjectList(student.dbId);
            Object.keys(this.vm.reportCardMapping).forEach((key) => {
                if (key.match('parentExamination')) {
                    student[key] = {};
                    let maximumMarks = 10;
                    switch (key) {
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
                    student['mainSubjectList'].forEach((item) => {
                        student[key]['mainSubjectMarksList'].push(
                            this.getStudentSubjectMarks(student.dbId, item.parentSubject, this.vm.reportCardMapping[key], maximumMarks)
                        );
                    });
                    student[key]['extraSubjectMarksList'] = [];
                    student['extraSubjectList'].forEach((item) => {
                        student[key]['extraSubjectMarksList'].push(
                            this.getStudentSubjectMarks(student.dbId, item.parentSubject, this.vm.reportCardMapping[key], maximumMarks)
                        );
                    });
                    student[key]['extraSubFieldMarksList'] = [];

                    student['remark'] = this.extractStudentRemark(student.dbId);

                    if (key != 'parentExaminationProject') {
                        this.vm.extraFieldList.forEach((extraField) => {
                            extraField['extraSubFieldList'].forEach((extraSubField) => {
                                student[key]['extraSubFieldMarksList'].push(
                                    this.getStudentExtraSubFieldMarks(student.dbId, extraSubField.id, this.vm.reportCardMapping[key])
                                );
                            });
                        });
                    }
                    if (key == 'parentExaminationProject' || !this.vm.reportCardMapping.autoAttendance) {
                        student[key]['attendanceData'] = {
                            attendance: 0,
                            workingDays: 0,
                        };
                    } else {
                        student[key]['attendanceData'] = this.getStudentAttendanceExamData(student.dbId, key);
                    }
                }
            });
        });
    }

    populateStudentFinalReportCardHigh(): void {
        this.vm.studentFinalReportCardList = this.vm.filteredStudentList.filter((student) => {
            return student.selected;
        });
        this.vm.studentFinalReportCardList.forEach((student) => {
            Object.keys(this.vm.reportCardMapping).forEach((key) => {
                if (key.match('High')) {
                    student[key] = {};
                    student[key]['classTestList'] = this.classTestList.filter((item) => {
                        return item.parentExamination == this.vm.reportCardMapping[key];
                    });
                    student[key]['studentTestList'] = this.studentTestList.filter((item) => {
                        return item.parentStudent == student.dbId && item.parentExamination == this.vm.reportCardMapping[key];
                    });
                }
            });
            student['subjectList'] = this.classSubjectList
                .filter((item) => {
                    let length = this.studentSubjectList.filter((itemTwo) => {
                        return itemTwo.parentStudent == student.dbId && itemTwo.parentSubject == item.parentSubject;
                    }).length;
                    return item.mainSubject && length > 0;
                })
                .sort((a, b) => {
                    return a.orderNumber - b.orderNumber;
                });

            student['cceMarks'] = this.studentCCEMarksList.find((item) => {
                return item.parentStudent == student.dbId;
            });
            if (student['cceMarks'] == undefined) {
                student['cceMarks'] = 0;
            } else {
                student['cceMarks'] = parseFloat(
                    parseFloat(student['cceMarks'].marksObtained).toFixed(this.vm.reportCardMapping.maximumDecimalPoints)
                );
            }
            student['attendanceData'] = {
                attendance: 0,
                workingDays: 0,
            };

            student['remark'] = this.extractStudentRemark(student.dbId);

            this.studentAttendanceList.forEach((studentAttendance) => {
                if (studentAttendance.status === ATTENDANCE_STATUS_LIST[0]) {
                    student['attendanceData']['attendance'] += 1;
                    student['attendanceData']['workingDays'] += 1;
                } else if (studentAttendance.status === ATTENDANCE_STATUS_LIST[1]) {
                    student['attendanceData']['workingDays'] += 1;
                }
            });
        });
    }

    getStudentMainSubjectList(studentId: any): any {
        let subjectList = [];
        this.classSubjectList
            .filter((item) => {
                return item.mainSubject;
            })
            .sort((a, b) => {
                if (a.mainSubject && !b.mainSubject) {
                    return -1;
                }
                if (!a.mainSubject && b.mainSubject) {
                    return 1;
                }
                return a.orderNumber - b.orderNumber;
            })
            .forEach((item) => {
                if (this.isInStudentSubjectList(studentId, item.parentSubject)) {
                    subjectList.push(item);
                }
            });
        return subjectList;
    }

    getStudentExtraSubjectList(studentId: any): any {
        let subjectList = [];
        this.classSubjectList
            .filter((item) => {
                return !item.mainSubject;
            })
            .sort((a, b) => {
                if (a.mainSubject && !b.mainSubject) {
                    return -1;
                }
                if (!a.mainSubject && b.mainSubject) {
                    return 1;
                }
                return a.orderNumber - b.orderNumber;
            })
            .forEach((item) => {
                if (this.isInStudentSubjectList(studentId, item.parentSubject)) {
                    subjectList.push(item);
                }
            });
        return subjectList;
    }

    isInStudentSubjectList(studentId: any, subjectId: any): boolean {
        let result = false;
        this.studentSubjectList.every((item) => {
            if (item.parentStudent == studentId && item.parentSubject == subjectId) {
                result = true;
                return false;
            }
            return true;
        });
        return result;
    }

    getStudentSubjectMarks(studentId: any, subjectId: any, examinationId: any, maximumMarks: any): any {
        let classMarks = 0;
        let studentMarks = 0;
        this.classTestList.forEach((item) => {
            if (item.parentSubject == subjectId && item.parentExamination == examinationId) {
                classMarks += parseFloat(item.maximumMarks);
            }
        });
        this.studentTestList.forEach((item) => {
            if (item.parentStudent == studentId && item.parentSubject == subjectId && item.parentExamination == examinationId) {
                studentMarks += parseFloat(item.marksObtained);
            }
        });
        if (classMarks == 0) {
            classMarks = 1;
        }
        return parseFloat(((studentMarks * maximumMarks) / classMarks).toFixed(this.vm.reportCardMapping.maximumDecimalPoints));
    }

    getStudentExtraSubFieldMarks(studentId: any, extraSubFieldId: any, examinationId: any): any {
        let studentMarks = 0;
        this.studentExtraSubFieldList.every((item) => {
            if (item.parentStudent == studentId && item.parentExtraSubField == extraSubFieldId && item.parentExamination == examinationId) {
                studentMarks = parseFloat(item.marksObtained);
                return false;
            }
            return true;
        });
        return studentMarks;
    }

    getStudentAttendanceExamData(studentId: any, key: any): any {
        let result = {
            attendance: 0,
            workingDays: 0,
        };
        let key1 = 'attendance' + key.substr(17, key.length) + 'Start';
        let key2 = 'attendance' + key.substr(17, key.length) + 'End';
        if (this.vm.reportCardMapping[key1] != null && this.vm.reportCardMapping[key2] != null) {
            let startDate = new Date(this.vm.reportCardMapping[key1]);
            let endDate = new Date(this.vm.reportCardMapping[key2]);
            this.studentAttendanceList
                .filter((item) => {
                    let tempDate = new Date(item.dateOfAttendance);
                    if (item.parentStudent != studentId || tempDate < startDate || tempDate > endDate) {
                        return false;
                    }
                    return true;
                })
                .forEach((studentAttendance) => {
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

    extractStudentRemark(studentDbId): string {
        let remark = this.studentRemarksList.find((item) => {
            return item.parentStudent == studentDbId;
        });
        if (remark == undefined) return '';
        return remark.remark;
    }
}
