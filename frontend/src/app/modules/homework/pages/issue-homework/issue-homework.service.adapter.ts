
import { IssueHomeworkComponent } from './issue-homework.component';

export class IssueHomeworkServiceAdapter {

    vm: IssueHomeworkComponent;
    questionImagesFormData : any;
    constructor() {}

    // Data

    initializeAdapter(vm: IssueHomeworkComponent): void {
        this.vm = vm;
        this.questionImagesFormData = [];
    }

    //initialize data
    initializeData(): void {

        let request_class_subject_list = {
            'parentSchool' : this.vm.user.activeSchool.dbId, 
            'parentEmployee': this.vm.user.activeSchool.employeeId,
            'parentSession': this.vm.user.activeSchool.currentSessionDbId
        }
        this.vm.isSessionLoading = true;

        Promise.all([
            this.vm.subjectService.getObjectList(this.vm.subjectService.class_subject, request_class_subject_list),
            this.vm.subjectService.getObjectList(this.vm.subjectService.subject, {}),
            this.vm.classService.getObjectList(this.vm.classService.classs, {}),
            this.vm.classService.getObjectList(this.vm.classService.division, {}),
        ]).then(value => {
            // console.log(value[0]);
            // console.log(value[1]);
            // console.log(value[2]);
            // console.log(value[3]);
            this.vm.initialiseClassSubjectData(value[0], value[1], value[2], value[3]);
            this.vm.isSessionLoading =false;
        },error =>{
            this.vm.isSessionLoading =false;
        });
    }

    getHomeworks():any{
        this.vm.isLoading = true;
        this.vm.homeworkList = [];

        // const homework_data = {
        //     parentHomework__parentClassSubject: this.vm.selectedSubject.classSubjectDbId,
        // };

        Promise.all([
            this.vm.homeworkService.getObjectList(this.vm.homeworkService.homeworks, {parentClassSubject: this.vm.selectedSubject.classSubjectDbId}),
            // this.vm.homeworkService.getObjectList(this.vm.homeworkService.homework_question, {}),
            this.vm.homeworkService.getObjectList(this.vm.homeworkService.homework_status, {}),
        ]).then(value =>{
            console.log(value[0]);
            console.log(value[1]);
            this.vm.homeworkList =  value[0];         
            this.vm.isLoading = false;
        },error =>{
            this.vm.isLoading = false;
        });

    }


    
}