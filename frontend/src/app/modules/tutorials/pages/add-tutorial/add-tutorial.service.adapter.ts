import { AddTutorialComponent } from './add-tutorial.component';
import { INFORMATION_TYPE_LIST } from '../../../../classes/constants/information-type';

export class AddTutorialServiceAdapter {
    vm: AddTutorialComponent;

    classSectionSubjectList: any;
    informationMessageType: any;

    constructor() {}

    initializeAdapter(vm: AddTutorialComponent): void {
        this.vm = vm;
        this.informationMessageType = INFORMATION_TYPE_LIST.indexOf('Tutorial') + 1;
    }

    initializeData(): void {
        this.vm.htmlRenderer.isLoading = true;

        let class_subject_list = {
            parentSession: this.vm.user.activeSchool.currentSessionDbId,
            parentSchool: this.vm.user.activeSchool.dbId,
        };

        const fetch_student_section_data = {
            parentStudent__parentSchool: this.vm.user.activeSchool.dbId,
            parentSession: this.vm.user.activeSchool.currentSessionDbId,
        };

        Promise.all([
            this.vm.classService.getObjectList(this.vm.classService.classs, {}), //0
            this.vm.classService.getObjectList(this.vm.classService.division, {}), //1
            this.vm.subjectService.getObjectList(this.vm.subjectService.class_subject, class_subject_list), //2
            this.vm.subjectService.getObjectList(this.vm.subjectService.subject, {}), //3
            this.vm.studentService.getObjectList(this.vm.studentService.student_section, fetch_student_section_data), //4
            this.vm.tutorialService.getObjectList(this.vm.tutorialService.tutorial_settings, {
                parentSchool: this.vm.user.activeSchool.dbId,
            }), //5
            this.vm.smsOldService.getSMSCount({ parentSchool: this.vm.user.activeSchool.dbId }, this.vm.user.jwt), //6
        ]).then(
            (value) => {
                this.vm.smsBalance = value[6];
                if (value[5].length > 0) {
                    this.vm.settings = value[5][0];
                } else {
                    this.vm.settings = {
                        sentUpdateType: 1,
                        sendCreateUpdate: false,
                        sendEditUpdate: false,
                        sendDeleteUpdate: false,
                    };
                }
                this.vm.backendData.classList = value[0];
                this.vm.backendData.sectionList = value[1];
                this.vm.backendData.classSubjectList = value[2];
                this.vm.backendData.subjectList = value[3];
                this.vm.backendData.fullStudentList = value[4];
                this.vm.subjectList = this.vm.backendData.subjectList;
                this.populateClassSectionSubjectList();
                this.populateDefaults();
                this.vm.htmlRenderer.isLoading = false;
            },
            (error) => {
                this.vm.htmlRenderer.isLoading = false;
            }
        );
    }

    populateClassSectionSubjectList(): void {
        this.classSectionSubjectList = [];
        this.vm.backendData.classList.forEach((classs) => {
            let tempClass = {};
            Object.keys(classs).forEach((key) => {
                tempClass[key] = classs[key];
            });
            tempClass['sectionList'] = [];
            this.vm.backendData.sectionList.forEach((section) => {
                let tempSection = {};
                Object.keys(section).forEach((key) => {
                    tempSection[key] = section[key];
                });

                tempSection['parentClass'] = classs.id;
                tempSection['subjectList'] = [];

                this.vm.backendData.classSubjectList.forEach((classSubject) => {
                    if (
                        classSubject.parentClass === tempClass['id'] &&
                        classSubject.parentDivision === tempSection['id'] &&
                        classSubject.parentEmployee === this.vm.user.activeSchool.employeeId
                    ) {
                        let tempSubject = {};

                        Object.keys(classSubject).forEach((key) => {
                            tempSubject[key] = classSubject[key];
                        });
                        tempSection['subjectList'].push(tempSubject);
                    }
                });
                if (tempSection['subjectList'].length > 0 && this.containsStudent(tempSection)) {
                    tempClass['sectionList'].push(tempSection);
                }
            });
            if (tempClass['sectionList'].length > 0) {
                tempClass['selectedSection'] = tempClass['sectionList'][0];
                this.classSectionSubjectList.push(tempClass);
            }
        });
    }

    populateDefaults() {
        this.vm.classSectionSubjectList = [];
        this.vm.classSectionSubjectList = this.classSectionSubjectList;
        if (this.vm.classSectionSubjectList.length > 0) {
            this.vm.userInput.selectedClass = this.vm.classSectionSubjectList[0];
            this.vm.userInput.selectedSection = this.vm.userInput.selectedClass.sectionList[0];
            this.vm.userInput.selectedSubject = this.vm.userInput.selectedSection.subjectList[0];
        }
    }

    containsStudent(sectionTemp: any) {
        return this.vm.backendData.fullStudentList.some((student) => {
            return student.parentDivision === sectionTemp.id && student.parentClass === sectionTemp.parentClass;
        });
    }

    async getTutorialList() {
        this.vm.htmlRenderer.showTutorialDetails = true;
        this.vm.htmlRenderer.isTutorialDetailsLoading = true;
        let request_class_subject_tutorial_data = {
            parentClassSubject: this.vm.getParentClassSubject(),
        };
        const value = await Promise.all([
            this.vm.tutorialService.getObjectList(this.vm.tutorialService.tutorial, request_class_subject_tutorial_data),
        ]);

        this.populateTutorialList(value[0]);
        await this.prepareStudentList();
        this.vm.userInput.initializeNewTutorial();
        this.vm.htmlRenderer.isTutorialDetailsLoading = false;
    }

    populateTutorialList(tutorialList) {
        tutorialList.forEach((tutorial) => {
            tutorial['editable'] = false;
        });
        tutorialList.sort((a, b) => parseFloat(a.orderNumber) - parseFloat(b.orderNumber));
        this.vm.tutorialList = tutorialList;
    }

    addNewTutorial(): void {
        if (!this.vm.decimalRegex.test(this.vm.userInput.newTutorial.orderNumber) || this.vm.userInput.newTutorial.orderNumber <= 0) {
            if (this.vm.tutorialList.length == 0) {
                this.vm.userInput.newTutorial.orderNumber = 1;
            } else {
                this.vm.userInput.newTutorial.orderNumber = (
                    parseFloat(this.vm.tutorialList[this.vm.tutorialList.length - 1].orderNumber) + 0.1
                ).toFixed(1);
            }
        }
        this.vm.htmlRenderer.isLoading = true;
        let data = {
            id: this.vm.userInput.newTutorial.id,
            parentClassSubject: this.vm.userInput.newTutorial.parentClassSubject,
            chapter: this.vm.userInput.newTutorial.chapter,
            topic: this.vm.userInput.newTutorial.topic,
            link: this.vm.userInput.newTutorial.link,
            orderNumber: this.vm.userInput.newTutorial.orderNumber,
        };

        Promise.all([this.vm.tutorialService.createObject(this.vm.tutorialService.tutorial, data)]).then(
            (value) => {
                value[0]['editable'] = false;
                this.populateStudentList(this.vm.userInput.newTutorial);
                this.vm.tutorialList.push(value[0]);
                this.vm.tutorialList.sort((a, b) => parseFloat(a.orderNumber) - parseFloat(b.orderNumber));
                this.vm.userInput.initializeNewTutorial();
                this.vm.htmlRenderer.isLoading = false;
                if (this.vm.settings.sentUpdateType != 1 && this.vm.settings.sendCreateUpdate == true) {
                    this.vm.updateService.sendSMSNotificationNew(
                        this.vm.currentClassStudentList,
                        this.vm.createMessage,
                        this.informationMessageType,
                        this.vm.settings.sentUpdateType,
                        this.vm.user.activeSchool.dbId,
                        this.vm.smsBalance
                    );
                }
            },
            (error) => {
                this.vm.htmlRenderer.isLoading = false;
            }
        );
    }

    makeEditableOrSave(tutorial: any): void {
        if (tutorial.editable) {
            if (!this.areInputsValid(this.vm.userInput.editedTutorial)) {
                return;
            }

            this.vm.htmlRenderer.tutorialUpdating = true;
            this.vm.tutorialEditing = false;

            let data = {
                id: this.vm.userInput.editedTutorial.id,
                parentClassSubject: this.vm.userInput.editedTutorial.parentClassSubject,
                chapter: this.vm.userInput.editedTutorial.chapter,
                topic: this.vm.userInput.editedTutorial.topic,
                link: this.vm.userInput.editedTutorial.link,
                orderNumber: this.vm.userInput.editedTutorial.orderNumber,
            };

            Promise.all([this.vm.tutorialService.updateObject(this.vm.tutorialService.tutorial, data)]).then(
                (value) => {
                    Object.assign(
                        this.vm.tutorialList.find((t) => t.id === tutorial.id),
                        value[0]
                    );
                    this.vm.tutorialList.sort((a, b) => parseFloat(a.orderNumber) - parseFloat(b.orderNumber)); //getSortedFunction()
                    this.vm.htmlRenderer.tutorialUpdating = false;
                    tutorial.editable = false;
                    this.populateStudentList(value[0]);
                    if (this.vm.settings.sentUpdateType != 1 && this.vm.settings.sendEditUpdate == true) {
                        this.vm.updateService.sendSMSNotificationNew(
                            this.vm.currentClassStudentList,
                            this.vm.editMessage,
                            this.informationMessageType,
                            this.vm.settings.sentUpdateType,
                            this.vm.user.activeSchool.dbId,
                            this.vm.smsBalance
                        );
                    }
                    this.vm.htmlRenderer.checkEnableAddButton();
                },
                (error) => {
                    this.vm.htmlRenderer.tutorialUpdating = false;
                    tutorial.editable = false;
                }
            );
            this.vm.tutorialList.sort((a, b) => parseFloat(a.orderNumber) - parseFloat(b.orderNumber));
        } else {
            this.vm.userInput.editedTutorial = {};
            Object.keys(tutorial).forEach((key) => {
                this.vm.userInput.editedTutorial[key] = tutorial[key];
            });
            this.vm.tutorialEditing = true;
            tutorial.editable = true;
        }
    }

    areInputsValid(tutorial): boolean {
        if (!tutorial.chapter || tutorial.chapter.trim() == '') {
            alert('Tutorial Chapter should not be empty');
            return false;
        }
        if (!tutorial.topic || tutorial.topic.trim() == '') {
            alert('Tutorial topic should not be empty');
            return false;
        }
        if (this.vm.tutorialList.some((t) => t.chapter === tutorial.chapter && t.topic === tutorial.topic.trim() && t.id != tutorial.id)) {
            alert('The Topic already exists');
            return false;
        }
        if (!tutorial.link || tutorial.link.trim() == '') {
            alert('Tutorial link should not be empty');
            return false;
        }
        if (!this.vm.decimalRegex.test(tutorial.orderNumber) || parseFloat(tutorial.orderNumber) <= 0) {
            alert('OrderNumber should be greater than 0 with 1 decimal place');
            return false;
        }
        if (tutorial.link.match(this.vm.youtubeIdMatcher) === null) {
            alert('Please enter a valid link');
            return false;
        }
        if (!this.vm.youtubeRegex.test(tutorial.link.trim())) {
            alert('Please enter a valid link');
            return false;
        }
        if (tutorial.link.startsWith('www.')) {
            tutorial.link = 'https://' + tutorial.link;
        }
        return true;
    }

    removeOrCancel(tutorial: any): void {
        if (tutorial.editable) {
            this.vm.htmlRenderer.showTutorialDetails = false;
            this.vm.userInput.editedTutorial = {};
            tutorial.editable = false;
            this.vm.tutorialEditing = false;
            this.vm.htmlRenderer.showTutorialDetails = true;
        } else {
            if (confirm('Are you sure you want to delete this tutorial?')) {
                this.vm.htmlRenderer.tutorialUpdating = true;
                Promise.all([this.vm.tutorialService.deleteObject(this.vm.tutorialService.tutorial, tutorial)]).then(
                    (value) => {
                        this.vm.tutorialList = this.vm.tutorialList.filter((item) => {
                            return item.id != tutorial.id;
                        });
                        this.vm.htmlRenderer.checkEnableAddButton();
                        this.populateStudentList(tutorial);
                        this.vm.htmlRenderer.tutorialUpdating = false;
                        if (this.vm.settings.sentUpdateType != 1 && this.vm.settings.sendDeleteUpdate == true) {
                            this.vm.updateService.sendSMSNotificationNew(
                                this.vm.currentClassStudentList,
                                this.vm.deleteMessage,
                                this.informationMessageType,
                                this.vm.settings.sentUpdateType,
                                this.vm.user.activeSchool.dbId,
                                this.vm.smsBalance
                            );
                        }
                    },
                    (error) => {
                        this.vm.htmlRenderer.tutorialUpdating = false;
                    }
                );
            }
        }
    }

    async prepareStudentList() {
        this.vm.currentClassStudentList = [];
        let student_list = this.vm.backendData.fullStudentList.filter((student) => {
            if (student.parentClass == this.vm.userInput.selectedClass.id && student.parentDivision == this.vm.userInput.selectedSection.id) return true;
            return false;
        });
        let studentIdList = [];
        student_list.forEach((student) => {
            studentIdList.push(student.parentStudent);
        });
        let student_data = {
            id__in: studentIdList,
            fields__korangle: 'id,name,mobileNumber',
        };
        const value = await this.vm.studentService.getObjectList(this.vm.studentService.student, student_data);
        this.vm.currentClassStudentList = value;
        this.vm.updateService.fetchGCMDevicesNew(this.vm.currentClassStudentList);
    }

    populateStudentList(tutorial): any {
        this.vm.currentClassStudentList.forEach((student) => {
            if (student.tutorialChapter == undefined) {
                student['tutorialChapter'] = tutorial.chapter;
            } else {
                student.tutorialChapter = tutorial.chapter;
            }
            if (student.tutorialTopic == undefined) {
                student['tutorialTopic'] = tutorial.topic;
            } else {
                student.tutorialTopic = tutorial.topic;
            }
            if (student.subject == undefined) {
                student['subject'] = this.vm.htmlRenderer.getSubjectName(this.vm.userInput.selectedSubject);
            } else {
                student.subject = this.vm.htmlRenderer.getSubjectName(this.vm.userInput.selectedSubject);
            }
        });
    }
}
