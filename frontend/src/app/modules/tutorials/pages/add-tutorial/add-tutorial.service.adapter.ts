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

    constructor(
    ) { }


    initializeAdapter(vm: AddTutorialComponent): void {
        this.vm = vm;
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
            this.vm.classService.getObjectList(this.vm.classService.classs, {}),
            this.vm.classService.getObjectList(this.vm.classService.division, {}),
            this.vm.subjectService.getObjectList(this.vm.subjectService.class_subject, class_subject_list),
            this.vm.subjectService.getObjectList(this.vm.subjectService.subject, {}),
            this.vm.studentService.getObjectList(this.vm.studentService.student_section, fetch_student_section_data),
        ]).then(value => {

            this.classList = value[0];
            this.sectionList = value[1];
            this.classSubjectList = value[2];
            this.subjectList = value[3];
            this.fullStudentList = value[4];
            this.populateSubjectList();
            this.populateClassSectionList();
            this.populateDefaults();
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

                tempSection['parentClass'] = classs.id
                tempSection['subjectList'] = [];
                tempSection['containStudent'] = this.containsStudent(tempSection);

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
                if (tempSection['subjectList'].length > 0 && tempSection['containStudent']) {
                    tempClass['sectionList'].push(tempSection);
                }
            });
            if (tempClass['sectionList'].length > 0) {
                tempClass['selectedSection'] = tempClass['sectionList'][0];
                this.classSectionSubjectList.push(tempClass);
            }
        });

    }

    populateSubjectList(): void {
        this.vm.subjectList = this.subjectList;
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
        }, error => {
        });
        this.vm.initializeNewTutorial();
        this.vm.showTutorialDetails = true;
        this.vm.isAddDisabled = true; // Add button is disabled
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
            value['editable'] = false;
            this.vm.tutorialList.push(value);
            this.vm.tutorialList.sort((a, b) => parseFloat(a.orderNumber) - parseFloat(b.orderNumber));
            this.vm.initializeNewTutorial();
            this.vm.isLoading = false;
        }, error => {
            this.vm.isLoading = false;
        });
        this.vm.isAddDisabled = true;
        this.vm.showPreview = false;
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
                this.vm.tutorialList.sort((a, b) => parseFloat(a.orderNumber) - parseFloat(b.orderNumber));
                this.vm.tutorialUpdating = false;
                tutorial.editable = false;
                this.checkEnableAddButton();
            }, error => {
                this.vm.tutorialUpdating = false;
                tutorial.editable = false;
            });
            this.vm.tutorialList.sort((a, b) => parseFloat(a.orderNumber) - parseFloat(b.orderNumber));
        } else {

            this.vm.editedTutorial = [];
            Object.keys(tutorial).forEach(key => {
                this.vm.editedTutorial[key] = tutorial[key];
            });
            this.vm.tutorialEditing = true;
            tutorial.editable = true;

        }
    }

    removeOrCancel(tutorial: any): void {
        if (tutorial.editable) {
            this.vm.showTutorialDetails = false;
            this.vm.editedTutorial = [];
            tutorial.editable = false;
            this.vm.tutorialEditing = false;
            this.vm.showTutorialDetails = true;
        } else {
            this.vm.tutorialUpdating = true;
            this.vm.tutorialService.deleteObject(this.vm.tutorialService.tutorial, tutorial).then(value => {
                this.vm.tutorialList = this.vm.tutorialList.filter(item => {
                    return item.id != tutorial.id;
                });
                this.checkEnableAddButton();
                this.vm.tutorialUpdating = false;
            }, error => {
                this.vm.tutorialUpdating = false;
            });
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
        if (!this.decimalRegex.test(tutorial.orderNumber) || parseFloat(tutorial.orderNumber) <= 0) {
            alert('OrderNumber should be greater than 0 with 1 decimal place');
            return false;
        }
        if (!this.youtubeRegex.test(tutorial.link.trim())) {
            alert('Please enter a valid link');
            return false;
        }
        if (tutorial.link.startsWith('www.')) {
            tutorial.link = 'https://' + tutorial.link;
        }
        return true;
    }

    checkEnableAddButton() {
        const tutorial = this.vm.newTutorial;
        this.vm.topicAlreadyPresent = tutorial.topic && this.vm.tutorialList.some(t => t.chapter === tutorial.chapter && t.topic === tutorial.topic.trim());

        if (!tutorial.link || tutorial.link.trim() == '') {
            this.vm.isAddDisabled = true;
            this.vm.showPreview = false;
            return;
        }

        if (this.youtubeRegex.test(tutorial.link.trim())) {
            if (tutorial.link.startsWith('www.')) {
                tutorial.link = 'https://' + tutorial.link;
            }
            this.vm.previewBeforeAddTutorialUrl = tutorial.link.replace('watch?v=', 'embed/');
            this.vm.showPreview = true;
            if (!tutorial.chapter || tutorial.chapter.trim() == '') {
                this.vm.isAddDisabled = true;
                return;
            } else if (!tutorial.topic || tutorial.topic.trim() == '' || this.vm.tutorialList.some(t => t.chapter === tutorial.chapter && t.topic === tutorial.topic.trim())) {
                this.vm.isAddDisabled = true;
                return;
            } else {
                this.vm.topicAlreadyPresent = false;
                this.vm.isAddDisabled = false;
                this.vm.topicAlreadyPresent = false;
            }
        } else {
            this.vm.showPreview = false;
            this.vm.isAddDisabled = true;
        }
    }

    populateTutorialList(tutorialList) {
        tutorialList.forEach(tutorial => {
            tutorial['editable'] = false;
        });
        tutorialList.sort((a, b) => parseFloat(a.orderNumber) - parseFloat(b.orderNumber));
        this.vm.tutorialList = tutorialList;
    }

    containsStudent(sectionTemp: any) {
        return this.fullStudentList.some(student => {
            return student.parentDivision === sectionTemp.id && student.parentClass === sectionTemp.parentClass
        });
    }

    populateDefaults() {

        this.vm.classSectionSubjectList = [];
        this.vm.classSectionSubjectList = this.classSectionSubjectList;
        if (this.vm.classSectionSubjectList.length > 0) {
            this.vm.selectedClass = this.vm.classSectionSubjectList[0];
            this.vm.selectedSection = this.vm.selectedClass.sectionList[0];
            this.vm.selectedSubject = this.vm.selectedSection.subjectList[0];
        }
    }


    prepareStudentList(): any{
        let student_list = this.fullStudentList.filter(student =>{
            if(student.parentClass == this.vm.selectedClass.id && student.parentDivision == this.vm.selectedSection.id) return true;
            return false; 
        })
        this.vm.updateService.setStudentList(student_list);
        console.log(student_list);
    }
}
