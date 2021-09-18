import {IssueHomeworkComponent} from './issue-homework.component';
import {Homework} from '../../../../services/modules/homework/models/homework';
import {CommonFunctions} from '../../../../classes/common-functions.js';
import {getValidStudentSectionList} from '@modules/classes/valid-student-section-service';

export class IssueHomeworkServiceAdapter {
    vm: IssueHomeworkComponent;
    constructor() {}

    studentNotificationList: any;
    // Data

    initializeAdapter(vm: IssueHomeworkComponent): void {
        this.vm = vm;
    }

    //initialize data
    async initializeData() {
        let request_class_subject_list = {
            parentEmployee: this.vm.user.activeSchool.employeeId,
            parentSession: this.vm.user.activeSchool.currentSessionDbId,
        };

        this.vm.isInitialLoading = true;

        const value = await Promise.all([
            this.vm.subjectService.getObjectList(this.vm.subjectService.class_subject, request_class_subject_list), //0
            this.vm.subjectService.getObjectList(this.vm.subjectService.subject, {}), //1
            this.vm.classService.getObjectList(this.vm.classService.classs, {}), //2
            this.vm.classService.getObjectList(this.vm.classService.division, {}), //3
            this.vm.smsOldService.getSMSCount({parentSchool: this.vm.user.activeSchool.dbId}, this.vm.user.jwt), //4
        ]);
        this.vm.smsBalance = value[4].count;

        this.vm.dataForMapping['classSubjectList'] = value[0];
        this.vm.dataForMapping['subjectList'] = value[1];
        this.vm.dataForMapping['classList'] = value[2];
        this.vm.dataForMapping['divisionList'] = value[3];
        this.vm.dataForMapping['school'] = this.vm.user.activeSchool;

        let permitted_class_list = [];
        let permitted_section_list = [];
        value[0].forEach((element) => {
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
        this.initialiseClassSubjectData(value[0], value[1], value[2], value[3]);
        this.vm.isInitialLoading = false;

    }

    initialiseClassSubjectData(classSectionSubjectList: any, subjectList: any, classList: any, divisionList: any) {
        this.vm.classSectionSubjectList = [];
        // filtering the classSectionSubjects in which there are no Active Students
        classSectionSubjectList = classSectionSubjectList.filter(classSectionSubject => this.vm.studentSectionList.some(studentSec => studentSec.parentClass ==
            classSectionSubject.parentClass && studentSec.parentDivision == classSectionSubject.parentDivision));
        if (classSectionSubjectList.length === 0) {
            this.vm.noPermission = true;
            this.vm.isLoading = false;
            this.vm.isInitialLoading = false;
            return;
        }
        classSectionSubjectList.forEach((element) => {
            let classSection = this.vm.classSectionSubjectList.find(
                (classSection) => classSection.classDbId == element.parentClass && classSection.divisionDbId == element.parentDivision
            );
            if (classSection === undefined) {
                let tempClass = classList.find((classs) => classs.id == element.parentClass);
                let tempDivision = divisionList.find((division) => division.id == element.parentDivision);
                let tempClassSection = {
                    classDbId: element.parentClass,
                    divisionDbId: element.parentDivision,
                    name: tempClass.name + ' ' + tempDivision.name,
                    subjectList: [],
                };
                this.vm.classSectionSubjectList.push(tempClassSection);
                classSection = this.vm.classSectionSubjectList.find(
                    (classSection) => classSection.classDbId == element.parentClass && classSection.divisionDbId == element.parentDivision
                );
            }
            let subject = classSection.subjectList.find((subject) => subject.subjectDbId == element.parentSubject);
            if (subject === undefined) {
                let tempSubject = subjectList.find((subject) => subject.id == element.parentSubject);
                let tempSubjectData = {
                    classSubjectDbId: element.id,
                    subjectDbId: tempSubject.id,
                    name: tempSubject.name,
                };
                classSection.subjectList.push(tempSubjectData);
            }
        });

        this.vm.classSectionSubjectList.forEach((classsSection) => {
            classsSection.subjectList.sort((a, b) => (a.subjectDbId < b.subjectDbId ? -1 : a.subjectDbId > b.subjectDbId ? 1 : 0));
        });
        this.vm.classSectionSubjectList.sort((a, b) => {
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
        this.vm.selectedClassSection = this.vm.classSectionSubjectList[0];
        this.vm.selectedSubject = this.vm.selectedClassSection.subjectList[0];
    }

    async getHomeworks() {
        this.vm.isLoading = true;
        this.vm.showContent = false;
        this.vm.homeworkList = [];
        this.studentNotificationList = [];

        const homework_data = {
            parentHomeworkQuestion__parentClassSubject: this.vm.selectedSubject.classSubjectDbId,
        };

        Promise.all([
            this.vm.homeworkService.getObjectList(this.vm.homeworkService.homework_question, {
                parentClassSubject: this.vm.selectedSubject.classSubjectDbId,
            }), //0
            this.vm.homeworkService.getObjectList(this.vm.homeworkService.homework_question_image, homework_data), //1
            // this.vm.
        ]).then(
            (value) => {
                this.vm.homeworkImagesList = value[1];
                this.initialiseHomeworks(value[0], value[1]);
                let student_data = {
                    id__in: this.vm.studentSectionList.map(studentSection => studentSection.parentStudent).join(','),,
                    fields__korangle: 'id,name,mobileNumber,fathersName,scholarNumber',
                };
                Promise.all([this.vm.studentService.getObjectList(this.vm.studentService.student, student_data)]).then((value) => {
                    value[0].forEach((element) => {
                        let tempData = CommonFunctions.getInstance().copyObject(element);
                        this.studentNotificationList.push(tempData);
                    });
                    this.vm.messageService.fetchGCMDevicesNew(this.studentNotificationList);
                    this.vm.dataForMapping['studentList'] = this.studentNotificationList;
                    this.vm.isLoading = false;
                });
                this.sortHomeworks();
                this.vm.isLoading = false;
                this.vm.showContent = true;
            },
            (error) => {
                this.vm.isLoading = false;
                this.vm.showContent = true;
            }
        );
    }

    initialiseHomeworks(homeworksList: any, homeworkImageList: any): any {
        this.vm.homeworkList = [];
        homeworksList.forEach((currentHomework) => {
            let tempHomework = this.vm.homeworkList.find((homework) => homework.id == currentHomework.id);
            if (tempHomework === undefined) {
                let tempData = JSON.parse(JSON.stringify(currentHomework));
                tempData.homeworkImages = [];
                this.vm.homeworkList.push(tempData);
                tempHomework = tempData;
            }
            homeworkImageList.forEach((image) => {
                if (image.parentHomeworkQuestion == currentHomework.id) {
                    tempHomework.homeworkImages.push(image);
                }
            });
        });

        this.vm.homeworkList.forEach((homework) => {
            homework.homeworkImages.sort((a, b) => (a.orderNumber < b.orderNumber ? -1 : a.orderNumber > b.orderNumber ? 1 : 0));
        });
    }

    getHomeworkServices(): any {
        let index = 0;
        let promises = [];
        this.vm.currentHomeworkImages.forEach((image) => {
            image.parentHomeworkQuestion = this.vm.currentHomework.id;
            image.orderNumber = index;
            let temp_form_data = new FormData();
            const layout_data = {...image};
            Object.keys(layout_data).forEach((key) => {
                if (key === 'questionImage') {
                    temp_form_data.append(key, CommonFunctions.dataURLtoFile(layout_data[key], 'questionImage' + index + '.jpeg'));
                } else {
                    temp_form_data.append(key, layout_data[key]);
                }
            });
            index = index + 1;
            promises.push(this.vm.homeworkService.createObject(this.vm.homeworkService.homework_question_image, temp_form_data));
        });

        return promises;
    }

    async createHomework() {
        this.vm.isLoading = true;
        this.vm.currentHomework.parentClassSubject = this.vm.selectedSubject.classSubjectDbId;
        let currentDate = new Date();
        this.vm.currentHomework.startDate = CommonFunctions.formatDate(currentDate, '');
        this.vm.currentHomework.startTime = CommonFunctions.formatTime(currentDate);

        if (this.vm.currentHomework.endDate != null && this.vm.currentHomework.endTime == null) {
            this.vm.currentHomework.endTime = '23:59';
        }

        const value = await Promise.all([this.vm.homeworkService.createObject(this.vm.homeworkService.homework_question, this.vm.currentHomework)]);
        this.vm.currentHomework.id = value[0].id;
        this.populateCurrentHomework();
        const sValue = await Promise.all(this.getHomeworkServices());
        alert('Homework has been successfully created');

        this.sendNotificationToParents(this.vm.currentHomework, this.vm.HOMEWORK_CREATION_EVENT_DBID);
        this.populateCurrentHomeworkImages(value[0].id, sValue);
        this.vm.currentHomework = new Homework();
        this.vm.currentHomeworkImages = [];
        this.vm.isLoading = false;
    }

    sortHomeworks(): any {
        this.vm.homeworkList.sort((a, b) => (a.id > b.id ? -1 : a.id < b.id ? 1 : 0));
    }

    populateCurrentHomework(): any {
        let tempHomework = JSON.parse(JSON.stringify(this.vm.currentHomework));
        tempHomework.homeworkImages = [];
        this.vm.homeworkList.push(tempHomework);
        this.sortHomeworks();
    }

    populateCurrentHomeworkImages(homeworkId: any, imagesList: any): any {
        let tempHomework = this.vm.homeworkList.find((homework) => homework.id == homeworkId);
        imagesList.forEach((image) => {
            if (image.questionImage != undefined) {
                tempHomework.homeworkImages.push(image);
            }
        });
        this.sortHomeworks();
    }


    async deleteHomework(homeworkId: any) {
        if (!confirm('Are you sure you want to delete this homework?')) {
            return;
        }
        let tempHomework;

        this.vm.isLoading = true;
        const value = await this.vm.homeworkService.deleteObject(this.vm.homeworkService.homework_question, {id: homeworkId});
        this.vm.homeworkList.forEach((homework, index) => {
            if (homework.id == homeworkId) {
                tempHomework = homework;
                this.vm.homeworkList.splice(index, 1);
            }
        });

        this.sendNotificationToParents(tempHomework, this.vm.HOMEWORK_DELETION_EVENT_DBID);
        alert('Homework Deleted');
        this.vm.isLoading = false;
    }

    async updateHomework(data: any) {
        const promises = [];
        let previousHomework = this.vm.homeworkList.find((homework) => homework.id === data.id);

        let tempHomeworkData = JSON.parse(JSON.stringify(data));
        delete tempHomeworkData.editRequired;
        delete tempHomeworkData.homeworkImages;

        promises.push(this.vm.homeworkService.updateObject(this.vm.homeworkService.homework_question, tempHomeworkData));

        let index = 0;
        data.homeworkImages.forEach((image) => {
            let temp = previousHomework.homeworkImages.find((images) => images.questionImage === image.questionImage);
            if (temp === undefined) {
                let tempData = {
                    orderNumber: index,
                    parentHomeworkQuestion: data.id,
                    questionImage: image.questionImage,
                };
                let temp_form_data = new FormData();
                const layout_data = {...tempData};
                Object.keys(layout_data).forEach((key) => {
                    if (key === 'questionImage') {
                        temp_form_data.append(key, CommonFunctions.dataURLtoFile(layout_data[key], 'questionImage' + index + '.jpeg'));
                    } else {
                        temp_form_data.append(key, layout_data[key]);
                    }
                });
                promises.push(this.vm.homeworkService.createObject(this.vm.homeworkService.homework_question_image, temp_form_data));
            } else {
                let tempData = {
                    id: temp.id,
                    orderNumber: index,
                };
                promises.push(this.vm.homeworkService.partiallyUpdateObject(this.vm.homeworkService.homework_question_image, tempData));
                let tempIndex = previousHomework.homeworkImages.indexOf(temp);
                previousHomework.homeworkImages.splice(tempIndex, 1);
            }
            index = index + 1;
        });

        previousHomework.homeworkImages.forEach((image) => {
            promises.push(this.vm.homeworkService.deleteObject(this.vm.homeworkService.homework_question_image, image));
        });

        const value = await Promise.all(promises);
        this.populateEditedHomework(value);
        this.sendNotificationToParents(value[0], this.vm.HOMEWORK_UPDATION_EVENT_DBID);
        alert('Homework Edited Successfully');
        this.vm.isLoading = false;
    }

    populateEditedHomework(data: any): any {
        let tempHomeworkData = data[0];
        let previousHomework = this.vm.homeworkList.find((homework) => homework.id === tempHomeworkData.id);
        previousHomework.homeworkName = tempHomeworkData.homeworkName;
        previousHomework.endDate = tempHomeworkData.endDate;
        previousHomework.endTime = tempHomeworkData.endTime;
        previousHomework.homeworkText = tempHomeworkData.homeworkText;
        previousHomework.homeworkImages = [];
        data.forEach((image) => {
            if (image.questionImage != undefined) {
                previousHomework.homeworkImages.push(image);
            }
        });
    }

    sendNotificationToParents(currentHomework: any, eventId: any) {
        this.vm.dataForMapping['homework'] = currentHomework;
        this.vm.messageService.fetchEventDataAndSendEventSMSNotification(
            this.vm.dataForMapping,
            ['student'],
            eventId,
            this.vm.user.activeSchool.dbId,
            this.vm.smsBalance
        );
    }
}
