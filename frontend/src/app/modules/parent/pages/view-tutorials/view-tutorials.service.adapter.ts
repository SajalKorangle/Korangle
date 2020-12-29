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
            parentStudent: this.vm.user.section.student.id,
            parentSession: this.vm.user.activeSchool.currentSessionDbId,
        };

        let class_subject_list = {
            'parentSession': this.vm.user.activeSchool.currentSessionDbId,
            'parentSchool': this.vm.user.activeSchool.dbId,
        };

        const fetch_student_section_data = {
            'parentStudent': this.vm.user.section.student.id,
            'parentSession': this.vm.user.activeSchool.currentSessionDbId,
        };


        Promise.all([
            this.vm.subjectService.getObjectList(this.vm.subjectService.class_subject, class_subject_list),
            this.vm.subjectService.getObjectList(this.vm.subjectService.subject, {}),
            this.vm.subjectService.getObjectList(this.vm.subjectService.student_subject, request_student_subject_data),
            this.vm.studentService.getObjectList(this.vm.studentService.student_section, fetch_student_section_data),

        ]).then(value => {
            this.vm.classSubjectList = value[0];
            this.vm.subjectList = value[1];
            this.vm.studentSubjectList = value[2];
            this.studentProfile = value[3][0];
            this.populateSubjectChapterTopic();
            this.vm.isLoading = false;
        }, error => {
            this.vm.isLoading = false;
        });

    }


    populateSubjectChapterTopic() {
        this.filteredStudentSubject = [];
        this.vm.selectedSubject = {};
        this.vm.selectedChapter = {};
        let studentIndex = 0;
         this.vm.noTutorials = false;

        this.vm.studentSubjectList.forEach(subject => {
            studentIndex++;
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
                }
                if (studentIndex === this.vm.studentSubjectList.length) {
                    if (this.filteredStudentSubject.length > 0) {
                        this.vm.filteredStudentSubject=this.filteredStudentSubject;
                        this.vm.selectedSubject = this.filteredStudentSubject[0];
                        this.vm.selectedChapter = this.vm.selectedSubject.chapterList[0];
                        this.vm.selectedTopic = this.vm.selectedChapter.topicList[0];
                        this.vm.setTutorialVideo();
                        this.vm.noTutorials = false;
                    } else {
                        this.vm.noTutorials = true; // to show no tutorials present if none subject has a tutorial
                    }
                }
            }, error => {
                this.vm.isLoading = false;
            });
        });

    }


    getParentClassSelectedSubject(subject: any): number {
        const classSub = this.vm.classSubjectList.filter(classSubject => {
            if (classSubject.parentClass == this.studentProfile.parentClass && classSubject.parentDivision == this.studentProfile.parentDivision && classSubject.parentSubject == subject.parentSubject) {
                return classSubject;
            }
        });
        return classSub[0].id;
    }

}


