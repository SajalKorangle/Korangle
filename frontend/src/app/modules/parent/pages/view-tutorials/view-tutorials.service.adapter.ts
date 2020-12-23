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
    filteredStudentSubject: any;


    initializeAdapter(vm: ViewTutorialsComponent): void {
        this.vm = vm;
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
            this.studentProfile = value[3];
            this.populateSubjectChapterTopic();
            this.vm.isLoading = false;
        }, error => {
            this.vm.isLoading = false;
        });

    }


    populateSubjectChapterTopic() {
        this.filteredStudentSubject = [];
        this.vm.selectedSubject = [];
        this.vm.selectedChapter = [];

        this.vm.studentSubjectList.forEach(subject => {

            let request_tutorials_data = {
                'parentClassSubject': this.getParentClassSelectedSubject(subject),
            };
            Promise.all([
                this.vm.tutorialService.getObjectList(this.vm.tutorialService.tutorial, request_tutorials_data),
            ]).then(value => {
                if (value[0].length > 0) {
                    subject['parentClassSubject'] = value[0][0].parentClassSubject;
                    subject['chapterList'] = [];
                    value[0].forEach(tutorial => {
                        if (subject.chapterList.length < 0 || !subject.chapterList.some(chap => chap.name === tutorial.chapter)) {
                            let tempChapter = {};
                            tempChapter['name'] = tutorial.chapter;
                            tempChapter['topicList'] = [];
                            let tempTopic = {};
                            Object.keys(tutorial).forEach(key => {
                                tempTopic[key] = tutorial[key];
                            });
                            tempChapter['topicList'].push(tempTopic);
                            subject.chapterList.push(tempChapter);
                        } else {
                            subject.chapterList.find(chap => chap.name === tutorial.chapter).topicList.push(tutorial);
                        }
                    });
                    this.filteredStudentSubject.push(subject);
                    this.vm.selectedSubject = subject;
                    this.vm.selectedChapter = this.vm.selectedSubject.chapterList[0];
                    this.vm.selectedTopic = this.vm.selectedChapter.topicList[0];
                    this.vm.setTutorialVideo();
                    console.log(this.vm.selectedChapter);
                }
                console.log(this.filteredStudentSubject);
            }, error => {
                this.vm.isLoading = false;
            });
        });
    }


    getParentClassSelectedSubject(subject: any): number {
        const classSub = this.vm.classSubjectList.filter(classSubject => {
            if (classSubject.parentClass == this.studentProfile.classDbId && classSubject.parentDivision == this.studentProfile.sectionDbId && classSubject.parentSubject == subject.parentSubject) {
                return classSubject;
            }
        });
        return classSub[0].id;
    }

}


