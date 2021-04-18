import { ViewTutorialsComponent } from '@modules/parent/pages/view-tutorials/view-tutorials.component';

export class ViewTutorialsServiceAdapter {
    vm: ViewTutorialsComponent;

    constructor() {}

    // Data
    subjectList: any;
    examinationList: any;
    classSubjectList: any;
    studentSubjectList: any;
    classTestList: any;
    studentTestList: any;
    studentProfile: any;
    filteredStudentSubject: any;
    tutorialList: any;

    initializeAdapter(vm: ViewTutorialsComponent): void {
        this.vm = vm;
    }

    //initialize data
    async initializeData() {
        this.vm.isLoading = true;

        const request_student_subject_data = {
            parentStudent: this.vm.user.section.student.id,
            parentSession: this.vm.user.activeSchool.currentSessionDbId,
        };

        let class_subject_list = {
            parentSession: this.vm.user.activeSchool.currentSessionDbId,
            parentSchool: this.vm.user.activeSchool.dbId,
        };

        const fetch_student_section_data = {
            parentStudent: this.vm.user.section.student.id,
            parentSession: this.vm.user.activeSchool.currentSessionDbId,
        };

        const value = await Promise.all([
            this.vm.subjectService.getObjectList(this.vm.subjectService.class_subject, class_subject_list), //0
            this.vm.subjectService.getObjectList(this.vm.subjectService.subject, {}), //1
            this.vm.subjectService.getObjectList(this.vm.subjectService.student_subject, request_student_subject_data), //2
            this.vm.studentService.getObjectList(this.vm.studentService.student_section, fetch_student_section_data), //3
        ]);

        this.vm.classSubjectList = value[0];
        this.vm.subjectList = value[1];
        this.vm.studentSubjectList = value[2];
        this.studentProfile = value[3][0];
        await this.populateTutorialList();
        this.vm.isLoading = false;
    }

    getParentClassSubjectFor(subject: any): number {
        const classSub = this.vm.classSubjectList.filter((classSubject) => {
            if (
                classSubject.parentClass == this.studentProfile.parentClass &&
                classSubject.parentDivision == this.studentProfile.parentDivision &&
                classSubject.parentSubject == subject.parentSubject
            ) {
                return classSubject;
            }
        });
        return classSub.length > 0 ? classSub[0].id : null;
    }

    async populateTutorialList() {
        this.filteredStudentSubject = [];
        this.vm.selectedSubject = {};
        this.vm.selectedChapter = {};
        this.tutorialList = [];
        this.vm.noTutorials = false;

        let request_tutorials_data = {
            parentClassSubject__in: this.vm.studentSubjectList
                .map((a) => this.getParentClassSubjectFor(a))
                .filter((a) => a != null)
                .join(),
        };
        const value = await Promise.all([this.vm.tutorialService.getObjectList(this.vm.tutorialService.tutorial, request_tutorials_data)]);
        this.tutorialList = value[0];
        this.populateFilteredSubjectTutorialList();
    }

    populateFilteredSubjectTutorialList() {
        if (this.tutorialList.length > 0) {
            this.vm.studentSubjectList.forEach((subject) => {
                subject['chapterList'] = [];
                this.tutorialList.forEach((tutorial) => {
                    if (tutorial && tutorial.parentClassSubject === this.getParentClassSubjectFor(subject)) {
                        if (subject.chapterList.length < 0 || !subject.chapterList.some((chap) => chap.name === tutorial.chapter)) {
                            let tempChapter = {};
                            tempChapter['name'] = tutorial.chapter;
                            tempChapter['topicList'] = [];
                            let tempTopic = {};
                            Object.keys(tutorial).forEach((key) => {
                                tempTopic[key] = tutorial[key];
                            });
                            tempChapter['topicList'].push(tempTopic);
                            subject.chapterList.push(tempChapter);
                        } else {
                            subject.chapterList.find((chap) => chap.name === tutorial.chapter).topicList.push(tutorial);
                        }
                    }
                });
                if (subject.chapterList.length > 0) {
                    this.filteredStudentSubject.push(subject);
                }
            });
            this.vm.filteredStudentSubject = this.filteredStudentSubject;
            this.vm.selectedSubject = this.filteredStudentSubject[0];
            this.vm.selectedChapter = this.vm.selectedSubject.chapterList[0];
            this.vm.selectedTopic = this.vm.selectedChapter.topicList[0];
            this.vm.setTutorialVideo();
            this.vm.noTutorials = false;
        } else {
            this.vm.noTutorials = true; // to show no tutorials present if none subject has a tutorial
        }
    }
}
