import { AddTutorialComponent } from './add-tutorial.component';
import {CommonFunctions} from '@modules/common/common-functions';

export class AddTutorialServiceAdapter {
    vm: AddTutorialComponent;

    constructor() {}

    initializeAdapter(vm: AddTutorialComponent): void {
        this.vm = vm;
    }

    async initializeData() {
        this.vm.stateKeeper.isLoading = true;

        const routeInformation = CommonFunctions.getModuleTaskPaths();
        const in_page_permission_request = {
            parentTask__parentModule__path: routeInformation.modulePath,
            parentTask__path: routeInformation.taskPath,
            parentEmployee: this.vm.user.activeSchool.employeeId,
        };

        this.vm.backendData.inPagePermissionMappedByKey = (await
            this.vm.employeeService.getObject(this.vm.employeeService.employee_permissions, in_page_permission_request)).configJSON;

        let class_subject_list = {
            parentSession: this.vm.user.activeSchool.currentSessionDbId,
            parentSchool: this.vm.user.activeSchool.dbId,
        };

        const fetch_student_section_data = {
            parentStudent__parentSchool: this.vm.user.activeSchool.dbId,
            parentSession: this.vm.user.activeSchool.currentSessionDbId,
        };

        const value = await Promise.all([
            this.vm.classService.getObjectList(this.vm.classService.classs, {}), //0
            this.vm.classService.getObjectList(this.vm.classService.division, {}), //1
            this.vm.subjectService.getObjectList(this.vm.subjectService.class_subject, class_subject_list), //2
            this.vm.subjectService.getObjectList(this.vm.subjectService.subject, {}), //3
            this.vm.studentService.getObjectList(this.vm.studentService.student_section, fetch_student_section_data), //4
            this.vm.smsOldService.getSMSCount({parentSchool: this.vm.user.activeSchool.dbId}, this.vm.user.jwt), //5
        ]);

        this.vm.smsBalance = value[5].count;

        this.vm.backendData.classList = value[0];
        this.vm.backendData.sectionList = value[1];
        this.vm.backendData.classSubjectList = value[2];
        this.vm.backendData.subjectList = value[3];
        this.vm.backendData.fullStudentList = value[4];

        this.vm.dataForMapping['classList'] = value[0];
        this.vm.dataForMapping['divisionList'] = value[1];
        this.vm.dataForMapping['subjectList'] = value[3];
        this.vm.dataForMapping['classSubjectList'] = value[2];
        this.vm.dataForMapping['school'] = this.vm.user.activeSchool;

        this.populateClassSectionSubjectList();
        this.populateDefaults();
        this.vm.stateKeeper.isLoading = false;
    }

    populateClassSectionSubjectList(): void {
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
                        (classSubject.parentEmployee === this.vm.user.activeSchool.employeeId || this.vm.hasAdminPermission())
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
                this.vm.classSectionSubjectList.push(tempClass);
            }
        });
    }

    populateDefaults() {
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
        this.vm.stateKeeper.subjectChangedButNotGet = false;
        this.vm.stateKeeper.isTutorialDetailsLoading = true;
        let request_class_subject_tutorial_data = {
            parentClassSubject: this.vm.getParentClassSubject(),
        };
        const value = await Promise.all([
            this.vm.tutorialService.getObjectList(this.vm.tutorialService.tutorial, request_class_subject_tutorial_data),
        ]);

        this.populateTutorialList(value[0]);
        await this.prepareStudentList();
        this.vm.initializeNewTutorial();
        this.vm.stateKeeper.isTutorialDetailsLoading = false;
    }

    populateTutorialList(tutorialList) {
        tutorialList.forEach((tutorial) => {
            tutorial['editable'] = false;
        });
        tutorialList.sort((a, b) => parseFloat(a.orderNumber) - parseFloat(b.orderNumber));
        this.vm.tutorialList = tutorialList;
    }

    async addNewTutorial() {
        if (!this.vm.decimalRegex.test(this.vm.userInput.newTutorial.orderNumber) || this.vm.userInput.newTutorial.orderNumber <= 0) {
            if (this.vm.tutorialList.length == 0) {
                this.vm.userInput.newTutorial.orderNumber = 1;
            } else {
                this.vm.userInput.newTutorial.orderNumber = (
                    parseFloat(this.vm.tutorialList[this.vm.tutorialList.length - 1].orderNumber) + 0.1
                ).toFixed(1);
            }
        }
        this.vm.stateKeeper.isLoading = true;
        let data = {
            id: this.vm.userInput.newTutorial.id,
            parentClassSubject: this.vm.getParentClassSubject(),
            chapter: this.vm.userInput.newTutorial.chapter,
            topic: this.vm.userInput.newTutorial.topic,
            link: this.vm.userInput.newTutorial.link,
            orderNumber: this.vm.userInput.newTutorial.orderNumber,
        };

        const value = await Promise.all([this.vm.tutorialService.createObject(this.vm.tutorialService.tutorial, data)]);

        value[0]['editable'] = false;
        this.vm.tutorialList.push(value[0]);
        this.vm.tutorialList.sort((a, b) => parseFloat(a.orderNumber) - parseFloat(b.orderNumber));
        this.vm.initializeNewTutorial();
        this.sendNotificationToParents(value[0], this.vm.TUTORIAL_CREATION_ID);
        this.vm.stateKeeper.isLoading = false;
    }

    async makeEditableOrSave(tutorial: any) {
        if (tutorial.editable) {
            if (!this.areInputsValid(this.vm.userInput.editedTutorial)) {
                return;
            }

            this.vm.stateKeeper.tutorialUpdating = true;
            this.vm.stateKeeper.tutorialEditing = false;

            let data = {
                id: this.vm.userInput.editedTutorial.id,
                parentClassSubject: this.vm.getParentClassSubject(),
                chapter: this.vm.userInput.editedTutorial.chapter,
                topic: this.vm.userInput.editedTutorial.topic,
                link: this.vm.userInput.editedTutorial.link,
                orderNumber: this.vm.userInput.editedTutorial.orderNumber,
            };

            const value = await Promise.all([this.vm.tutorialService.updateObject(this.vm.tutorialService.tutorial, data)]);

            Object.assign(
                this.vm.tutorialList.find((t) => t.id === tutorial.id),
                value[0]
            );
            this.vm.tutorialList.sort((a, b) => parseFloat(a.orderNumber) - parseFloat(b.orderNumber)); //getSortedFunction()
            this.vm.stateKeeper.tutorialUpdating = false;
            tutorial.editable = false;

            this.sendNotificationToParents(tutorial, this.vm.TUTORIAL_UPDATION_ID);
            this.vm.htmlRenderer.checkEnableAddButton();
            this.vm.tutorialList.sort((a, b) => parseFloat(a.orderNumber) - parseFloat(b.orderNumber));

        } else {
            this.vm.userInput.editedTutorial = {};
            Object.keys(tutorial).forEach((key) => {
                this.vm.userInput.editedTutorial[key] = tutorial[key];
            });
            this.vm.stateKeeper.tutorialEditing = true;
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

    async removeOrCancel(tutorial: any) {
        if (tutorial.editable) {
            this.vm.userInput.editedTutorial = {};
            tutorial.editable = false;
            this.vm.stateKeeper.tutorialEditing = false;
        } else {
            if (confirm('Are you sure you want to delete this tutorial?')) {
                this.vm.stateKeeper.tutorialUpdating = true;
                const value = await Promise.all([this.vm.tutorialService.deleteObject(this.vm.tutorialService.tutorial, tutorial)]);
                this.vm.tutorialList = this.vm.tutorialList.filter((item) => {
                    return item.id != tutorial.id;
                });
                this.vm.htmlRenderer.checkEnableAddButton();
                this.sendNotificationToParents(tutorial, this.vm.TUTORIAL_DELETION_ID);
                this.vm.stateKeeper.tutorialUpdating = false;
            }
        }
    }

    async prepareStudentList() {
        this.vm.currentClassStudentList = [];
        let student_list = this.vm.backendData.fullStudentList.filter((student) => {
            return student.parentClass == this.vm.userInput.selectedClass.id && student.parentDivision == this.vm.userInput.selectedSection.id;
        });
        let studentIdList = [];
        student_list.forEach((student) => {
            studentIdList.push(student.parentStudent);
        });
        let student_data = {
            id__in: studentIdList,
            fields__korangle: 'id,name,mobileNumber,fathersName,scholarNumber',
        };
        const value = await Promise.all([
            this.vm.studentService.getObjectList(this.vm.studentService.student, student_data), //0
            this.vm.studentService.getObjectList(this.vm.studentService.student_section, {parentStudent__in: studentIdList}) //1
        ]);
        this.vm.currentClassStudentList = value[0];
        this.vm.backendData.currentClassStudentSectionList = value[1];
        this.vm.dataForMapping['studentSectionList'] = value[1];
        this.vm.messageService.fetchGCMDevicesNew(this.vm.currentClassStudentList);
        this.vm.dataForMapping['studentList'] = this.vm.currentClassStudentList;
    }

    sendNotificationToParents(currentTutorial: any, eventId: number) {
        this.vm.dataForMapping['tutorial'] = currentTutorial;
        this.vm.messageService.fetchEventDataAndSendEventSMSNotification(
            this.vm.dataForMapping,
            ['student'],
            eventId,
            this.vm.user.activeSchool.dbId,
            this.vm.smsBalance
        );
    }
}
