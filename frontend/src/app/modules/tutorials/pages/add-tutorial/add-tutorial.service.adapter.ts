import {AddTutorialComponent} from './add-tutorial.component';


export class AddTutorialServiceAdapter {
    vm: AddTutorialComponent;

    classList: any;
    sectionList: any;
    classSubjectList: any;
    subjectList: any;
    youtubeRegex = /^(https?\:\/\/)?((www\.)?youtube\.com|youtu\.?be)\/.+$/;
    decimalRegex = /^-?[0-9]*\.?[0-9]$/;
    classSectionSubjectList: any;
    fullStudentList: any;

    constructor() {
    }


    initializeAdapter(vm: AddTutorialComponent): void {
        this.vm = vm;
    }


    initializeData(): void {


        this.vm.isLoading = true;

        let request_class_subject_data = {
            'sessionList': [this.vm.user.activeSchool.currentSessionDbId],
            'schoolList': [this.vm.user.activeSchool.dbId],
        };
        const student_full_profile_request_data = {
            schoolDbId: this.vm.user.activeSchool.dbId,
            sessionDbId: this.vm.user.activeSchool.currentSessionDbId,
        };


        Promise.all([
            this.vm.classService.getObjectList(this.vm.classService.classs, {}),
            this.vm.classService.getObjectList(this.vm.classService.division, {}),
            this.vm.subjectService.getClassSubjectList(request_class_subject_data, this.vm.user.jwt),
            this.vm.subjectService.getSubjectList(this.vm.user.jwt),
            this.vm.studentOldService.getStudentFullProfileList(student_full_profile_request_data, this.vm.user.jwt),
        ]).then(value => {

            this.classList = value[0];
            this.sectionList = value[1];
            this.classSubjectList = value[2];
            this.subjectList = value[3];
            this.fullStudentList = value[4];
            this.populateSubjectList();
            this.populateClassSectionList();
            this.vm.isLoading = false;
        }, error => {
            this.vm.isLoading = false;
        });
    }

    populateClassSectionList(): void {
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
                tempSection['containStudent'] = false;
                tempSection['parentClass']=classs.id
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
                tempClass['sectionList'].push(tempSection);
            });
            tempClass['selectedSection'] = tempClass['sectionList'][0];
            this.classSectionSubjectList.push(tempClass);
        });

        this.vm.classSectionSubjectList = [];
        this.populateContainsStudent();
        this.vm.classSectionSubjectList = this.classSectionSubjectList;
        console.log(this.vm.classSectionSubjectList);
        this.vm.classSectionSubjectList[0].sectionList[0].selected = true;
        this.vm.selectedClass = this.vm.classSectionSubjectList[0];
        this.vm.selectedSection = this.vm.classSectionSubjectList[0].sectionList[0];
    }

    populateSubjectList(): void {
        this.vm.subjectList = this.subjectList;
    }

    getTutorialList(): void {
        this.vm.showTutorialDetails = false;
        if (this.vm.selectedSubject == null) {
            alert('Select the Subject');
        } else {
            this.vm.showTutorialDetails = false;
            let request_class_subject_tutorial_data = {
                'parentClassSubject': this.vm.getParentClassSubject()
            };
            Promise.all([
                this.vm.tutorialService.getObjectList(this.vm.tutorialService.tutorial, request_class_subject_tutorial_data),
            ]).then(value => {
                this.populateTutorialList(value[0]);
            }, error => {
            });
            this.vm.initializeNewTutorial();
            this.vm.showTutorialDetails = true;
            this.vm.isDisabled = true;
        }
    }

    addNewTutorial(): void {


        if (!this.decimalRegex.test(this.vm.newTutorial.orderNumber) || this.vm.newTutorial.orderNumber <= 0) {
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


        this.vm.tutorialService.createObject(this.vm.tutorialService.tutorial, data).then(value => {
            // alert('Tutorial created successfully');
            value['editable'] = false;
            this.vm.tutorialList.push(value);
            this.vm.tutorialList.sort((a, b) => parseFloat(a.orderNumber) - parseFloat(b.orderNumber));
            this.vm.initializeNewTutorial();
            this.vm.isLoading = false;
        }, error => {
            this.vm.isLoading = false;
        });
        this.vm.isDisabled = true;

    }

    makeEditableOrSave(tutorial: any): void {
        if (tutorial.editable) {
            if (!this.areInputsValid(tutorial)) {
                return;
            }

            this.vm.tutorialUpdating = true;
            let data = {
                'id': tutorial.id,
                'parentClassSubject': tutorial.parentClassSubject,
                'chapter': tutorial.chapter,
                'topic': tutorial.topic,
                'link': tutorial.link,
                'orderNumber': tutorial.orderNumber,
            };


            Promise.all([
                this.vm.tutorialService.updateObject(this.vm.tutorialService.tutorial, data),
            ]).then(value => {
                this.vm.tutorialUpdating = false;
            }, error => {
               this.vm.tutorialUpdating = false;
            });

            this.vm.tutorialList.sort((a, b) => parseFloat(a.orderNumber) - parseFloat(b.orderNumber));
            tutorial.editable = false;
            this.vm.tutorialEditing=false;
        } else {
            this.vm.tutorialEditing=true;
            tutorial.editable = true;
        }
    }

    removeOrCancel(tutorial: any): void {
        if (tutorial.editable) {
            this.getTutorialList();
            tutorial.editable = false;
            this.vm.tutorialEditing=false;
        } else {
            this.vm.tutorialService.deleteObject(this.vm.tutorialService.tutorial, tutorial).then(value => {
                this.vm.tutorialList = this.vm.tutorialList.filter(item => {
                    return item.id != tutorial.id;
                });
            }, error => {
            });
        }
    }


    populateSubjectTutorial(tutorials: any) {
        this.vm.selectedSubject['tutorialList'] = [];
        if (tutorials != undefined) {
            this.vm.selectedSubject.tutorialList = tutorials;
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
        if (!tutorial.link || tutorial.link.trim() == '') {
            alert('Tutorial link should not be empty');
            return false;
        }
        if (!this.decimalRegex.test(tutorial.orderNumber) || tutorial.orderNumber <= 0) {
            alert('OrderNumber should be greater than 0 with 1 decimal place');
            return;
        }
        if (!this.youtubeRegex.test(tutorial.link.trim())) {
            alert('Please enter a valid link');
            return false;
        }
        return true;
    }

    checkEnableAddButton() {
        const tutorial = this.vm.newTutorial;
        if (!tutorial.chapter || tutorial.chapter.trim() == '') {
            this.vm.isDisabled = true;
            return;
        } else if (!tutorial.topic || tutorial.topic.trim() == '') {
            this.vm.isDisabled = true;
            return;
        } else if (!tutorial.link || tutorial.link.trim() == '') {
            this.vm.isDisabled = true;
            return;
        } else if (!this.youtubeRegex.test(tutorial.link.trim())) {
            this.vm.isDisabled = true;
            return;
        } else {
            this.vm.previewBeforeAddTutorialUrl = tutorial.link.replace('watch?v=', 'embed/');
            this.vm.isDisabled = false;
        }

    }

    populateTutorialList(tutorialList) {
        tutorialList.sort((a, b) => parseFloat(a.orderNumber) - parseFloat(b.orderNumber));
        tutorialList.forEach(tutorial => {
            tutorial['editable'] = false;
            tutorial['isUpdating'] = false;
        });
        this.vm.tutorialList = tutorialList;
    }

    populateContainsStudent() {
        this.fullStudentList.forEach(student => {
            this.classSectionSubjectList.forEach(classs => {
                classs.sectionList.forEach(section => {
                    if (student.sectionDbId === section.id && student.classDbId === classs.id) {
                        section.containStudent = true;
                    }
                });
            });
        });
    }
}
