import { ViewTutorialsComponent } from '@modules/parent/pages/view-tutorials/view-tutorials.component';

export class ViewTutorialsServiceAdapter {
    vm: ViewTutorialsComponent;

    constructor() {}


    initializeAdapter(vm: ViewTutorialsComponent): void {
        this.vm = vm;
    }

    //initialize data
    async initializeData() {
        this.vm.stateKeeper.isLoading = true;

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

        this.vm.backendData.classSubjectList = value[0];
        this.vm.backendData.subjectList = value[1];
        this.vm.backendData.studentSubjectList = value[2];
        this.vm.backendData.studentProfile = value[3][0];
        await this.populateTutorialList();
        this.vm.stateKeeper.isLoading = false;
    }

    getParentClassSubjectFor(subject: any): number {
        const classSub = this.vm.backendData.classSubjectList.filter((classSubject) => {
            if (
                classSubject.parentClass == this.vm.backendData.studentProfile.parentClass &&
                classSubject.parentDivision == this.vm.backendData.studentProfile.parentDivision &&
                classSubject.parentSubject == subject.parentSubject
            ) {
                return classSubject;
            }
        });
        return classSub.length > 0 ? classSub[0].id : null;
    }

    async populateTutorialList() {
        this.vm.filteredStudentSubject = [];
        this.vm.userInput.selectedSubject = {};
        this.vm.userInput.selectedChapter = {};
        this.vm.backendData.tutorialList = [];

        let request_tutorials_data = {
            parentClassSubject__in: this.vm.backendData.studentSubjectList
                .map((a) => this.getParentClassSubjectFor(a))
                .filter((a) => a != null)
                .join(),
        };
        const value = await Promise.all([this.vm.tutorialService.getObjectList(this.vm.tutorialService.tutorial, request_tutorials_data)]);
        this.vm.backendData.tutorialList = value[0];
        this.populateFilteredSubjectTutorialList();
    }

    populateFilteredSubjectTutorialList() {
        if (this.vm.backendData.tutorialList.length > 0) {
            this.vm.backendData.studentSubjectList.forEach((subject) => {
                subject['chapterList'] = [];
                this.vm.backendData.tutorialList.forEach((tutorial) => {
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
                    this.vm.filteredStudentSubject.push(subject);
                }
            });
            this.vm.userInput.selectedSubject = this.vm.filteredStudentSubject[0];
            this.vm.userInput.selectedChapter = this.vm.userInput.selectedSubject.chapterList[0];
            this.vm.userInput.selectedTopic = this.vm.userInput.selectedChapter.topicList[0];
        }
    }
}
