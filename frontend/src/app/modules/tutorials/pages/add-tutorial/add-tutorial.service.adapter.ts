import {AddTutorialComponent} from './add-tutorial.component';
import { INFORMATION_TYPE_LIST } from '../../../../classes/constants/information-type'

export class AddTutorialServiceAdapter {
    vm: AddTutorialComponent;

    classList: any;
    sectionList: any;
    classSubjectList: any;
    subjectList: any;
    classSectionSubjectList: any;
    fullStudentList: any;
    informationMessageType: any;

    constructor(
    ) { }


    initializeAdapter(vm: AddTutorialComponent): void {
        this.vm = vm;
        this.informationMessageType = INFORMATION_TYPE_LIST.indexOf('Tutorial')+1;
    }


    initializeData(): void {


        this.vm.isLoading = true;

        let class_subject_list = {
            'parentSession': this.vm.user.activeSchool.currentSessionDbId,
            'parentSchool': this.vm.user.activeSchool.dbId,
        };

        const fetch_student_section_data = {
            'parentStudent__parentSchool': this.vm.user.activeSchool.dbId,
            'parentSession': this.vm.user.activeSchool.currentSessionDbId,
        };


        Promise.all([
            this.vm.classService.getObjectList(this.vm.classService.classs, {}),//0
            this.vm.classService.getObjectList(this.vm.classService.division, {}),//1
            this.vm.subjectService.getObjectList(this.vm.subjectService.class_subject, class_subject_list),//2
            this.vm.subjectService.getObjectList(this.vm.subjectService.subject, {}),//3
            this.vm.studentService.getObjectList(this.vm.studentService.student_section, fetch_student_section_data),//4
            this.vm.tutorialService.getObjectList(this.vm.tutorialService.tutorial_settings, {'parentSchool': this.vm.user.activeSchool.dbId}),//5
            this.vm.smsOldService.getSMSCount({'parentSchool': this.vm.user.activeSchool.dbId}, this.vm.user.jwt),//6
        ]).then(value => {
            this.vm.smsBalance = value[6];
            if(value[5].length > 0){
                this.vm.settings = value[5][0];
            }
            else{
                this.vm.settings = {
                    'sentUpdateType': 1,
                    'sendCreateUpdate': false,
                    'sendEditUpdate': false,
                    'sendDeleteUpdate': false,
                }
            }
            this.classList = value[0];
            this.sectionList = value[1];
            this.classSubjectList = value[2];
            this.subjectList = value[3];
            this.fullStudentList = value[4];
            this.vm.subjectList = this.subjectList;
            this.populateClassSectionSubjectList();
            this.populateDefaults();
            this.vm.isLoading = false;
        }, error => {
            this.vm.isLoading = false;
        });
    }


    populateClassSectionSubjectList(): void {
        this.classSectionSubjectList = [];
        this.classList.forEach(classs => {
            let tempClass = {};
            Object.keys(classs).forEach(key => {
                tempClass[key] = classs[key];
            });
            tempClass['sectionList'] = [];
            this.sectionList.forEach(section => {
                let tempSection = {};
                Object.keys(section).forEach(key => {
                    tempSection[key] = section[key];
                });

                tempSection['parentClass'] = classs.id
                tempSection['subjectList'] = [];

                this.classSubjectList.forEach(classSubject => {
                    if (classSubject.parentClass === tempClass['id']
                        && classSubject.parentDivision === tempSection['id']
                        && classSubject.parentEmployee === this.vm.user.activeSchool.employeeId) {
                        let tempSubject = {};

                        Object.keys(classSubject).forEach(key => {
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
            this.vm.selectedClass = this.vm.classSectionSubjectList[0];
            this.vm.selectedSection = this.vm.selectedClass.sectionList[0];
            this.vm.selectedSubject = this.vm.selectedSection.subjectList[0];
            this.vm.noSubjects = false;
        } else {
            this.vm.noSubjects = true;
        }
    }

     containsStudent(sectionTemp: any) {
        return this.fullStudentList.some(student => {
            return student.parentDivision === sectionTemp.id && student.parentClass === sectionTemp.parentClass
        });
    }


    getTutorialList(): void {
        this.vm.showTutorialDetails = false;
        let request_class_subject_tutorial_data = {
            'parentClassSubject': this.vm.getParentClassSubject()
        };
        Promise.all([
            this.vm.tutorialService.getObjectList(this.vm.tutorialService.tutorial, request_class_subject_tutorial_data),
        ]).then(value => {
            this.populateTutorialList(value[0]);
            this.vm.showTutorialDetails = true;
        }, error => {
        });
        this.vm.initializeNewTutorial();
         // Add button is disabled
    }

    populateTutorialList(tutorialList) {
        tutorialList.forEach(tutorial => {
            tutorial['editable'] = false;
        });
        tutorialList.sort((a, b) => parseFloat(a.orderNumber) - parseFloat(b.orderNumber));
        this.vm.tutorialList = tutorialList;
    }

    addNewTutorial(): void {

        if (!this.vm.decimalRegex.test(this.vm.newTutorial.orderNumber) || this.vm.newTutorial.orderNumber <= 0) {
            if (this.vm.tutorialList.length == 0) {
                this.vm.newTutorial.orderNumber = 1;
            } else {
                this.vm.newTutorial.orderNumber = (parseFloat(this.vm.tutorialList[this.vm.tutorialList.length - 1].orderNumber) + 0.1).toFixed(1);
            }
        }
        this.vm.isLoading = true;
        let data = {
            'id': this.vm.newTutorial.id,
            'parentClassSubject': this.vm.newTutorial.parentClassSubject,
            'chapter': this.vm.newTutorial.chapter,
            'topic': this.vm.newTutorial.topic,
            'link': this.vm.newTutorial.link,
            'orderNumber': this.vm.newTutorial.orderNumber,
        };

        Promise.all([
            this.vm.tutorialService.createObject(this.vm.tutorialService.tutorial, data),
        ]).then(value =>{
            value[0]['editable'] = false;
            this.populateStudentList(this.vm.newTutorial);
            this.vm.tutorialList.push(value[0]);
            this.vm.tutorialList.sort((a, b) => parseFloat(a.orderNumber) - parseFloat(b.orderNumber));
            this.vm.initializeNewTutorial();
            this.vm.isLoading = false;
            if(this.vm.settings.sentUpdateType != 1 && this.vm.settings.sendCreateUpdate == true){
                this.vm.updateService.sendSMSNotificationNew(this.vm.currentClassStudentList, this.vm.createMessage, this.informationMessageType, this.vm.settings.sentUpdateType, this.vm.user.activeSchool.dbId, this.vm.smsBalance);
            }
        }, error =>{
            this.vm.isLoading = false;
        })
    }

    makeEditableOrSave(tutorial: any): void {
        if (tutorial.editable) {
            if (!this.areInputsValid(this.vm.editedTutorial)) {
                return;
            }

            this.vm.tutorialUpdating = true;
            this.vm.tutorialEditing = false;

            let data = {
                'id': this.vm.editedTutorial.id,
                'parentClassSubject': this.vm.editedTutorial.parentClassSubject,
                'chapter': this.vm.editedTutorial.chapter,
                'topic': this.vm.editedTutorial.topic,
                'link': this.vm.editedTutorial.link,
                'orderNumber': this.vm.editedTutorial.orderNumber,
            };

            Promise.all([
                this.vm.tutorialService.updateObject(this.vm.tutorialService.tutorial, data),
            ]).then(value => {
                Object.assign(this.vm.tutorialList.find(t => t.id === tutorial.id), value[0]);
                this.vm.tutorialList.sort((a, b) => parseFloat(a.orderNumber) - parseFloat(b.orderNumber));//getSortedFunction()
                this.vm.tutorialUpdating = false;
                tutorial.editable = false;
                this.populateStudentList(value[0]);
                if(this.vm.settings.sentUpdateType != 1 && this.vm.settings.sendEditUpdate == true){
                    this.vm.updateService.sendSMSNotificationNew(this.vm.currentClassStudentList, this.vm.editMessage, this.informationMessageType, this.vm.settings.sentUpdateType, this.vm.user.activeSchool.dbId, this.vm.smsBalance);
                }
                this.vm.checkEnableAddButton();
            }, error => {
                this.vm.tutorialUpdating = false;
                tutorial.editable = false;
            });
            this.vm.tutorialList.sort((a, b) => parseFloat(a.orderNumber) - parseFloat(b.orderNumber));
        } else {

            this.vm.editedTutorial = {};
            Object.keys(tutorial).forEach(key => {
                this.vm.editedTutorial[key] = tutorial[key];
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
        if (this.vm.tutorialList.some(t => t.chapter === tutorial.chapter && t.topic === tutorial.topic.trim() && !t.id === tutorial.id)) {
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
        if(tutorial.link.match(this.vm.youtubeIdMatcher) === null)
        {
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
            this.vm.showTutorialDetails = false;
            this.vm.editedTutorial = {};
            tutorial.editable = false;
            this.vm.tutorialEditing = false;
            this.vm.showTutorialDetails = true;
        } else {
            if(confirm("Are you sure you want to delete this tutorial?")) {
                this.vm.tutorialUpdating = true;
                Promise.all([
                    this.vm.tutorialService.deleteObject(this.vm.tutorialService.tutorial, tutorial),
                ]).then(value => {
                    this.vm.tutorialList = this.vm.tutorialList.filter(item => {
                        return item.id != tutorial.id;
                    });
                    this.vm.checkEnableAddButton();
                    this.populateStudentList(tutorial);
                    this.vm.tutorialUpdating = false;
                    if (this.vm.settings.sentUpdateType != 1 && this.vm.settings.sendDeleteUpdate == true) {
                        this.vm.updateService.sendSMSNotificationNew(this.vm.currentClassStudentList, this.vm.deleteMessage, this.informationMessageType, this.vm.settings.sentUpdateType, this.vm.user.activeSchool.dbId, this.vm.smsBalance);
                    }
                }, error => {
                    this.vm.tutorialUpdating = false;
                });
            }
        }
    }


    prepareStudentList(): any{
        this.vm.currentClassStudentList = [];
        let student_list = this.fullStudentList.filter(student =>{
            if(student.parentClass == this.vm.selectedClass.id && student.parentDivision == this.vm.selectedSection.id) return true;
            return false; 
        })
        let studentIdList = [];
        student_list.forEach(student =>{
            studentIdList.push(student.parentStudent);
        });
        let student_data = {
            'id__in': studentIdList,
            'fields__korangle': 'id,name,mobileNumber',
        }
        Promise.all([
            this.vm.studentService.getObjectList(this.vm.studentService.student, student_data),
        ]).then(value =>{
            this.vm.currentClassStudentList = value[0];
            this.vm.updateService.fetchGCMDevicesNew(this.vm.currentClassStudentList);
        })
    }

    populateStudentList(tutorial): any{
        this.vm.currentClassStudentList.forEach(student =>{
            if(student.tutorialChapter == undefined){
                student['tutorialChapter'] = tutorial.chapter;
            }
            else{
                student.tutorialChapter = tutorial.chapter;
            }
            if(student.tutorialTopic == undefined){
                student['tutorialTopic'] = tutorial.topic;
            }
            else{
                student.tutorialTopic = tutorial.topic;
            }
            if(student.subject == undefined){
                student['subject'] = this.vm.getSubjectName(this.vm.selectedSubject);
            }
            else{
                student.subject = this.vm.getSubjectName(this.vm.selectedSubject);
            }
        });
    }


}
