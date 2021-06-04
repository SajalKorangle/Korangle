import {IssueHomeworkComponent} from './issue-homework.component';
import {Homework} from '../../../../services/modules/homework/models/homework';
import {CommonFunctions} from '../../../../classes/common-functions.js';
import moment = require('moment');

export class IssueHomeworkServiceAdapter {
    vm: IssueHomeworkComponent;

    constructor() {
    }

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
        this.vm.smsBalance = value[4];

        this.vm.dataForMapping['classSubjectList'] = value[0];
        this.vm.dataForMapping['classList'] = value[2];
        this.vm.dataForMapping['divisionList'] = value[3];
        this.vm.dataForMapping['school'] = this.vm.user.activeSchool;

        this.initialiseClassSubjectData(value[0], value[1], value[2], value[3]);
        this.vm.isInitialLoading = false;

    }

    initialiseClassSubjectData(classSectionSubjectList: any, subjectList: any, classList: any, divisionList: any) {
        this.vm.classSectionSubjectList = [];
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

    getHomeworks(): any {
        this.vm.isLoading = true;
        this.vm.showContent = false;
        this.vm.homeworkList = [];
        this.studentNotificationList = [];

        let student_section_data = {
            parentStudent__parentSchool: this.vm.user.activeSchool.dbId,
            parentClass: this.vm.selectedClassSection.classDbId,
            parentDivision: this.vm.selectedClassSection.divisionDbId,
            parentSession: this.vm.user.activeSchool.currentSessionDbId,
            fields__korangle: 'parentStudent',
        };

        const homework_data = {
            parentHomeworkQuestion__parentClassSubject: this.vm.selectedSubject.classSubjectDbId,
        };

        Promise.all([
            this.vm.homeworkService.getObjectList(this.vm.homeworkService.homework_question, {
                parentClassSubject: this.vm.selectedSubject.classSubjectDbId,
            }), //0
            this.vm.homeworkService.getObjectList(this.vm.homeworkService.homework_question_image, homework_data), //1
            this.vm.studentService.getObjectList(this.vm.studentService.student_section, student_section_data), //2
            // this.vm.
        ]).then(
            (value) => {
                this.vm.dataForMapping['studentSection'] = value[2];
                this.vm.homeworkImagesList = value[1];
                this.initialiseHomeworks(value[0], value[1]);
                let studentIdList = [];
                value[2].forEach((student) => {
                    studentIdList.push(student.parentStudent);
                });
                let student_data = {
                    id__in: studentIdList,
                    fields__korangle: 'id,name,mobileNumber',
                };
                Promise.all([this.vm.studentService.getObjectList(this.vm.studentService.student, student_data)]).then((value) => {
                    // value[0].forEach((element) => {
                    //     let tempData = {
                    //         dbId: element.id,
                    //         name: element.name,
                    //         mobileNumber: element.mobileNumber,
                    //         subject: this.vm.selectedSubject.name,
                    //         homeworkName: null,
                    //         deadLine: null,
                    //     };
                    //     this.studentNotificationList.push(tempData);
                    // });
                    this.studentNotificationList = value[0];
                    // this.fetchGCMDevices(this.studentNotificationList);
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

        this.populateStudentList(this.studentNotificationList, this.vm.currentHomework);
        this.vm.dataForMapping['homework'] = this.vm.currentHomework;
        this.populateCurrentHomeworkImages(value[0].id, sValue);
        this.vm.currentHomework = new Homework();
        this.vm.currentHomeworkImages = [];
        this.vm.isLoading = false;
        this.vm.messageService.sendEventNotification(
            this.vm.dataForMapping,
            'Homework Creation',
            this.vm.user.activeSchool.dbId,
            this.vm.smsBalance
        );
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

    populateStudentList(studentList: any, homeworkData: any): any {
        studentList.forEach((student) => {
            student.homeworkName = homeworkData.homeworkName;
            student.deadLine = this.vm.displayDateTime(homeworkData.endDate, homeworkData.endTime);
            student.date = moment(new Date()).format('DD/MM/YYYY');
            student.schoolName = this.vm.user.activeSchool.printName;
            student.studentName = student.name;
            student.class = this.vm.selectedClassSection;
        });
    }

    async deleteHomework(homeworkId: any) {
        if (!confirm('Are you sure you want to delete this homework?')) {
            return;
        }

        let tempHomeworkName;

        this.vm.isLoading = true;
        const value = await this.vm.homeworkService.deleteObject(this.vm.homeworkService.homework_question, {id: homeworkId});
        this.vm.homeworkList.forEach((homework, index) => {
            if (homework.id == homeworkId) {
                this.vm.dataForMapping['homework'] = homework;
                tempHomeworkName = homework.homeworkName;
                this.vm.homeworkList.splice(index, 1);
            }
        });
        this.vm.messageService.sendEventNotification(
            this.studentNotificationList,
            'Homework Deletion',
            this.vm.user.activeSchool.dbId,
            this.vm.smsBalance
        );
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
        this.vm.dataForMapping['homework'] = value[0];
        this.vm.messageService.sendEventNotification(
            this.studentNotificationList,
            'Homework Updation',
            this.vm.user.activeSchool.dbId,
            this.vm.smsBalance
        );
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
}
