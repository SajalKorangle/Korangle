import {ViewTutorialsComponent} from '@modules/parent/pages/view-tutorials/view-tutorials.component';

export class ViewTutorialsServiceAdapter {

    vm: ViewTutorialsComponent;

    constructor() {
    }

    // Data
    subjectList: any;
    examinationList: any;
    classSubjectList: any;
    studentSubjectList: any;
    classTestList: any;
    studentTestList: any;
    studentProfile: any;


    initializeAdapter(vm: ViewTutorialsComponent): void {
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

        const request_student_subject_data = {
            studentId: this.vm.user.section.student.id,
            sessionId: this.vm.user.activeSchool.currentSessionDbId,
        };

        let request_class_subject_data = {
            'sessionList': [this.vm.user.activeSchool.currentSessionDbId],
            'schoolList': [this.vm.user.activeSchool.dbId],
        };

        const request_student_data = {
            studentDbId: this.vm.user.section.student.id,
            sessionDbId: this.vm.user.activeSchool.currentSessionDbId,
        };


        Promise.all([
            this.vm.subjectService.getClassSubjectList(request_class_subject_data, this.vm.user.jwt),
            this.vm.subjectService.getSubjectList(this.vm.user.jwt),
            this.vm.subjectService.getStudentSubjectList(request_student_subject_data, this.vm.user.jwt),
            this.vm.studentService.getStudentFullProfile(request_student_data, this.vm.user.jwt),

        ]).then(value => {
            this.vm.classSubjectList = value[0];
            this.vm.subjectList = value[1];
            this.vm.studentSubjectList = value[2];
            console.log(this.vm.studentSubjectList);
            this.vm.selectedSubject = this.vm.studentSubjectList[0];
            this.studentProfile = value[3];
            this.getTutorialList();
            this.vm.isLoading = false;
        }, error => {
            this.vm.isLoading = false;
        });

    }


    getTutorialList() {
        this.vm.chapterList = [];
        this.vm.topicList = [];
        this.vm.showTutorialVideo = false;
        let request_tutorials_data = {
            'parentClassSubject': this.getParentClassSubject(),
        };
        Promise.all([
            this.vm.tutorialService.getObjectList(this.vm.tutorialService.tutorial, request_tutorials_data),
        ]).then(value => {
            this.populateTutorialList(value[0]);
        }, error => {
            this.vm.isLoading = false;
        });
    }

    populateTutorialList(tutorialList: any) {
        // this.vm.tutorialList=[];
        // this.vm.tutorialList=tutorialList;
        this.vm.selectedSubject['tutorialList'] = [];
        this.vm.selectedSubject['tutorialList'] = tutorialList;
        this.vm.selectedSubject.tutorialList.forEach(tutorial => {
            if (!this.vm.chapterList.find(chapter => {
                return chapter === tutorial.chapter
            })) {
                this.vm.chapterList.push(tutorial.chapter);
            }
        });
        console.log(this.vm.chapterList);
    }

    getParentClassSubject(): number {
        const classSub = this.vm.classSubjectList.filter(classSubject => {
            if (classSubject.parentClass == this.studentProfile.classDbId && classSubject.parentDivision == this.studentProfile.sectionDbId && classSubject.parentSubject == this.vm.selectedSubject.parentSubject) {
                return classSubject;
            }
        });
        return classSub[0].id;
    }
}


