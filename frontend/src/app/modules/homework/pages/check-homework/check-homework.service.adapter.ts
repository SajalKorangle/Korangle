import { CommonFunctions } from '@classes/common-functions';
import { CheckHomeworkComponent } from './check-homework.component';
import {getValidStudentSectionList} from '@modules/classes/valid-student-section-service';

export class CheckHomeworkServiceAdapter {
    vm: CheckHomeworkComponent;

    constructor() {}


    initializeAdapter(vm: CheckHomeworkComponent): void {
        this.vm = vm;
    }

    async initializeData() {
        this.vm.isInitialLoading = true;

        let request_homework_list = {
            parentClassSubject__parentEmployee: this.vm.user.activeSchool.employeeId,
            parentClassSubject__parentSession: this.vm.user.activeSchool.currentSessionDbId,
        };

        let request_class_subject_list = {
            parentEmployee: this.vm.user.activeSchool.employeeId,
            parentSession: this.vm.user.activeSchool.currentSessionDbId,
        };

       const value = await Promise.all([
            this.vm.subjectService.getObjectList(this.vm.subjectService.subject, {}), //0
            this.vm.classService.getObjectList(this.vm.classService.classs, {}), //1
            this.vm.classService.getObjectList(this.vm.classService.division, {}), //2
            this.vm.homeworkService.getObjectList(this.vm.homeworkService.homework_question, request_homework_list), //3
            this.vm.subjectService.getObjectList(this.vm.subjectService.class_subject, request_class_subject_list), //4
            this.vm.smsOldService.getSMSCount({ parentSchool: this.vm.user.activeSchool.dbId }, this.vm.user.jwt), //5
        ]);

        this.vm.smsBalance = value[5].count;
        this.vm.dataForMapping['subjectList'] = value[0];
        this.vm.dataForMapping['classList'] = value[1];
        this.vm.dataForMapping['divisionList'] = value[2];
        this.vm.dataForMapping['classSubjectList'] = value[4];
        this.vm.dataForMapping['school'] = this.vm.user.activeSchool;

        let permitted_class_list = [];
        let permitted_section_list = [];
        value[4].forEach((element) => {
            permitted_class_list.push(element.parentClass);
            permitted_section_list.push(element.parentDivision);
        });

        let student_section_data = {
            parentStudent__parentSchool: this.vm.user.activeSchool.dbId,
            parentStudent__parentTransferCertificate: 'null__korangle',
            parentClass__in: permitted_class_list,
            parentDivision__in: permitted_section_list,
            parentSession: this.vm.user.activeSchool.currentSessionDbId,
        };

        this.vm.studentSectionList = await getValidStudentSectionList(this.vm.tcService, this.vm.studentService, student_section_data);
        this.vm.dataForMapping['studentSectionList'] = this.vm.studentSectionList;
        this.initialiseClassSubjectData(value[0], value[1], value[2], value[3], value[4]);
        this.vm.isInitialLoading = false;
    }

    initialiseClassSubjectData(subjectList: any, classList: any, divisionList: any, homeworkList: any, classSectionSubjectList: any) {
        if (homeworkList.length == 0) {
            return;
        }
        this.vm.classSectionHomeworkList = [];
        homeworkList.forEach((homework) => {
            let tempClassSubject = classSectionSubjectList.find(
                (classSectionSubject) => classSectionSubject.id == homework.parentClassSubject
            );
            let checkStudentPresence = this.vm.studentSectionList.some(studSection => studSection.parentClass == tempClassSubject.parentClass &&
            studSection.parentDivision == tempClassSubject.parentDivision);
            if (checkStudentPresence) {
                let tempClass = classList.find((classs) => classs.id == tempClassSubject.parentClass);
                let tempDivision = divisionList.find((division) => division.id == tempClassSubject.parentDivision);
                let tempSubject = subjectList.find((subject) => subject.id == tempClassSubject.parentSubject);
                let currentClassSection = this.vm.classSectionHomeworkList.find(
                    (classSection) => classSection.classDbId == tempClass.id && classSection.divisionDbId == tempDivision.id
                );
                if (currentClassSection === undefined) {
                    let classSection = {
                        classDbId: tempClass.id,
                        className: tempClass.name,
                        divisionDbId: tempDivision.id,
                        divisionName: tempDivision.name,
                        subjectList: [],
                    };
                    this.vm.classSectionHomeworkList.push(classSection);
                    currentClassSection = this.vm.classSectionHomeworkList.find(
                        (classSection) => classSection.classDbId == tempClass.id && classSection.divisionDbId == tempDivision.id
                    );
                }

                let currentSubject = currentClassSection.subjectList.find((subject) => subject.dbId == tempSubject.id);
                if (currentSubject == undefined) {
                    let subject = {
                        dbId: tempSubject.id,
                        name: tempSubject.name,
                        homeworkList: [],
                    };
                    currentClassSection.subjectList.push(subject);
                    currentSubject = currentClassSection.subjectList.find((subject) => subject.dbId == tempSubject.id);
                }
                currentSubject.homeworkList.push(homework);
            }
        });
        if (this.vm.classSectionHomeworkList.length == 0) {
            return;
        }

        this.vm.classSectionHomeworkList.forEach((classSection) => {
            classSection.subjectList.forEach((subject) => {
                subject.homeworkList.sort((a, b) => (a.id > b.id ? -1 : a.id < b.id ? 1 : 0));
            });
            classSection.subjectList.sort((a, b) => (a.dbId < b.dbId ? -1 : a.dbId > b.dbId ? 1 : 0));
        });
        this.vm.classSectionHomeworkList.sort((a, b) => {
            if (a.classDbId > b.classDbId) {
                return 1;
            } else if (a.classDbId < b.classDbId) {
                return -1;
            } else {
                if (a.divisionDbId > b.divisionDbid) {
                    return 1;
                } else {
                    return -1;
                }
            }
        });

        this.vm.selectedClassSection = this.vm.classSectionHomeworkList[0];
        this.vm.selectedSubject = this.vm.selectedClassSection.subjectList[0];
    }

    async getHomework(homework: any) {
        this.vm.studentHomeworkList = [];
        this.vm.isChecking = true;
        this.vm.selectedHomework = homework;
        this.vm.isLoading = true;
        this.vm.studentList = [];
        this.vm.studentHomeworkList = [];
        let homework_data = {
            parentHomeworkQuestion: this.vm.selectedHomework.id,
        };

        this.vm.currentHomework = {
            name: this.vm.selectedHomework.homeworkName,
            startDate: this.vm.selectedHomework.startDate,
            startTime: this.vm.selectedHomework.startTime,
            endDate: this.vm.selectedHomework.endDate,
            endTime: this.vm.selectedHomework.endTime,
            text: this.vm.selectedHomework.homeworkText,
            images: [],
        };

        Promise.all([
            this.vm.homeworkService.getObjectList(this.vm.homeworkService.homework_question_image, homework_data)
        ]).then(
            (value) => {
                this.vm.currentHomework.images = value[0];
                this.vm.currentHomework.images.sort((a, b) => (a.orderNumber < b.orderNumber ? -1 : a.orderNumber > b.orderNumber ? 1 : 0));
                let studentIdList = [];
                this.vm.studentSectionList.forEach((studentSection) => {
                    if (studentSection.parentClass == this.vm.selectedClassSection.classDbId &&
                        studentSection.parentDivision == this.vm.selectedClassSection.divisionDbId) {
                        studentIdList.push(studentSection.parentStudent);
                    }
                });
                let student_data = {
                    id__in: studentIdList,
                    fields__korangle: 'id,name,mobileNumber,fathersName,scholarNumber',
                };
                let student_homework_data = {
                    parentHomeworkQuestion: this.vm.selectedHomework.id,
                };

                let student_homework_image_data = {
                    parentHomeworkAnswer__parentHomeworkQuestion: this.vm.selectedHomework.id,
                };
                Promise.all([
                    this.vm.studentService.getObjectList(this.vm.studentService.student, student_data), //0
                    this.vm.homeworkService.getObjectList(this.vm.homeworkService.homework_answer, student_homework_data), //1
                    this.vm.homeworkService.getObjectList(this.vm.homeworkService.homework_answer_image, student_homework_image_data), //2
                ]).then(
                    (value) => {
                        value[0].forEach((element) => {
                        this.vm.studentList.push(CommonFunctions.getInstance().copyObject(element));
                        });
                        this.initialiseStudentHomeworkData(value[2], value[1]);
                        if (value[1].length != studentIdList.length) {
                            const createList = [];
                            studentIdList.forEach((element) => {
                                let temp = value[1].find((student) => student.parentStudent == element);
                                if (temp == undefined) {
                                    let tempData = {
                                        parentStudent: element,
                                        parentHomeworkQuestion: this.vm.selectedHomework.id,
                                        homeworkStatus: 'GIVEN',
                                    };
                                    createList.push(tempData);
                                }
                            });
                            Promise.all([
                                this.vm.homeworkService.createObjectList(this.vm.homeworkService.homework_answer, createList),
                            ]).then((cValue) => {
                                this.initialiseStudentHomeworkData([], cValue[0]);
                                this.getHomeworkReport();
                                this.vm.isLoading = false;
                            });
                        } else {
                            this.getHomeworkReport();
                            this.vm.isLoading = false;
                        }
                        this.vm.messageService.fetchGCMDevicesNew(this.vm.studentList);
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

    initialiseStudentHomeworkData(studentHomeworkImagesList: any, studentHomeworkList: any): any {
        studentHomeworkList.forEach((studentHomework) => {
            let tempStudent = this.vm.studentList.find((student) => student.id == studentHomework.parentStudent);
            if (tempStudent) {
                let tempData = {
                    id: studentHomework.id,
                    studentName: tempStudent.name,
                    mobileNumber: tempStudent.mobileNumber,
                    parentStudent: studentHomework.parentStudent,
                    parentHomeworkQuestion: studentHomework.parentHomeworkQuestion,
                    status: studentHomework.homeworkStatus,
                    text: studentHomework.answerText,
                    remark: studentHomework.remark,
                    submissionDate: studentHomework.submissionDate,
                    submissionTime: studentHomework.submissionTime,
                    images: [],
                    isStatusLoading: false,
                    isRemarkLoading: false,
                };
                studentHomeworkImagesList.forEach((image) => {
                    if (image.parentHomeworkAnswer == tempData.id) {
                        tempData.images.push(image);
                    }
                });
                tempData.images.sort((a, b) => (a.orderNumber < b.orderNumber ? -1 : a.orderNumber > b.orderNumber ? 1 : 0));
                this.vm.studentHomeworkList.push(tempData);
            }
        });
    }

    getHomeworkReport(): any {
        let given = 0;
        let submitted = 0;
        let checked = 0;
        let resubmission = 0;
        this.vm.studentHomeworkList.forEach((student) => {
            if (student.status == this.vm.HOMEWORK_STATUS[0]) {
                given = given + 1;
            } else if (student.status == this.vm.HOMEWORK_STATUS[1]) {
                submitted = submitted + 1;
            } else if (student.status == this.vm.HOMEWORK_STATUS[2]) {
                checked = checked + 1;
            } else {
                resubmission = resubmission + 1;
            }
        });
        this.vm.homeworkReport = {
            given: given,
            submitted: submitted,
            checked: checked,
            resubmission: resubmission,
        };
    }
   async changeStudentHomeworkStatus(studentHomework: any) {
           studentHomework.isStatusLoading = true;
           let tempData = {
               id: studentHomework.id,
               homeworkStatus: studentHomework.status,
           };
           const value = await Promise.all([this.vm.homeworkService.partiallyUpdateObject(this.vm.homeworkService.homework_answer, tempData)]);

           if (studentHomework.status == this.vm.HOMEWORK_STATUS[2] || studentHomework.status == this.vm.HOMEWORK_STATUS[3]) {
               this.vm.dataForMapping['homework'] = this.vm.selectedHomework;
               this.vm.dataForMapping['subject'] = this.vm.selectedSubject;
               let eventID;
               if (studentHomework.status == this.vm.HOMEWORK_STATUS[2]) {
                   eventID = this.vm.HOMEWORK_CHECKED_EVENT_DBID;
               } else if (studentHomework.status == this.vm.HOMEWORK_STATUS[3]) {
                   eventID = this.vm.HOMEWORK_RESUBMISSION_EVENT_DBID;
               }

               this.vm.dataForMapping['studentList'] = [this.vm.studentList.find(stud => stud.id == studentHomework.parentStudent)];

               this.vm.messageService.fetchEventDataAndSendEventSMSNotification(
                   this.vm.dataForMapping,
                   ['student'],
                   eventID,
                   this.vm.user.activeSchool.dbId,
                   this.vm.smsBalance
               );
           }

           this.getHomeworkReport();
           studentHomework.isStatusLoading = false;
    }

    changeStudentRemark(studentHomework): any {
        if (studentHomework.remark == '') {
            return;
        }

        studentHomework.isRemarkLoading = true;
        let tempData = {
            id: studentHomework.id,
            remark: studentHomework.remark,
        };
        Promise.all([this.vm.homeworkService.partiallyUpdateObject(this.vm.homeworkService.homework_answer, tempData)]).then(
            (value) => {
                studentHomework.isRemarkLoading = false;
            },
            (error) => {
                studentHomework.isRemarkLoading = false;
            }
        );
    }
}
