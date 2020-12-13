
import { Homework } from 'app/services/modules/homework/models/homework';
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

        const homework_data = {
            parentHomework__parentClassSubject: this.vm.selectedSubject.classSubjectDbId,
        };

        Promise.all([
            this.vm.homeworkService.getObjectList(this.vm.homeworkService.homeworks, {parentClassSubject: this.vm.selectedSubject.classSubjectDbId}),
            this.vm.homeworkService.getObjectList(this.vm.homeworkService.homework_question, homework_data),
        ]).then(value =>{
            this.vm.homeworkImagesList = value[1];
            this.initialiseHomeworks(value[0], value[1]);        
            this.vm.isLoading = false;
        },error =>{
            this.vm.isLoading = false;
        });

    }

    initialiseHomeworks(homeworksList: any, homeworkImageList: any):any{
        this.vm.homeworkList = [];
        homeworksList.forEach(currentHomework =>{
            let tempHomework = this.vm.homeworkList.find(homework => homework.id ==  currentHomework.id);
            if(tempHomework === undefined){
                let tempData = {
                    id: currentHomework.id,
                    homeworkName: currentHomework.homeworkName,
                    parentClassSubject: currentHomework.parentClassSubject,
                    startDate: currentHomework.startDate,
                    startTime: currentHomework.startTime,
                    endDate: currentHomework.endDate,
                    endTime: currentHomework.endTime,
                    homeworkText: currentHomework.homeworkText,
                    homeworkImages: [],
                }
                this.vm.homeworkList.push(tempData);
                tempHomework = this.vm.homeworkList.find(homework => homework.id ==  currentHomework.id);
            }
            homeworkImageList.forEach(image =>{
                if(image.parentHomework == currentHomework.id){
                    tempHomework.homeworkImages.push(image.questionImage);
                }
            })

        });

    }


    deleteHomework(homeworkId: any): any{

        if(!confirm("Are you sure you want to delete this homework?")) {
            return;
        }
        this.vm.isLoading = true;
        this.vm.homeworkService.deleteObject(this.vm.homeworkService.homeworks, {id: homeworkId}).then(value =>{
            alert('Homework Deleted')
            this.getHomeworks();
            this.vm.isLoading = false;
        }),error =>{
            this.vm.isLoading = false;
        };
    }

    updateHomework(data :any): any{

        let previousHomework = this.vm.homeworkList.find(homework => homework.id === data.id);

        let tempHomeworkData = {
            id: data.id,
            homeworkName: data.homeworkName ,
            parentClassSubject: data.parentClassSubject,
            startDate: data.startDate,
            startTime: data.startTime,
            endDate: data.endDate,
            endTime: data.endTime,
            homeworkText: data.homeworkText,
        }

        const promises = [];

        let index = 0;
        promises.push(this.vm.homeworkService.updateObject(this.vm.homeworkService.homeworks, tempHomeworkData));
        data.homeworkImages.forEach(image =>{
            let temp = previousHomework.homeworkImages.find(images => images === image);
            if(temp === undefined){
                let tempData = {
                    parentHomework: data.id,
                    questionImage: image,
                }
                let temp_form_data = new FormData();
                const layout_data = { ...tempData,};
                Object.keys(layout_data).forEach(key => {
                    if (key === 'questionImage' ) {
                        temp_form_data.append(key, this.vm.dataURLtoFile(layout_data[key], 'questionImage' + index +'.jpeg'));
                    } else {
                        temp_form_data.append(key, layout_data[key]);
                    }
                });
                index = index + 1;
                promises.push(this.vm.homeworkService.createObject(this.vm.homeworkService.homework_question, temp_form_data));
            }
        });

        previousHomework.homeworkImages.forEach(image =>{
            let temp = data.homeworkImages.find(images => images === image);
            if(temp === undefined){
                let tempId = this.vm.homeworkImagesList.find(images => images.questionImage == image).id;
                console.log(tempId);
                promises.push(this.vm.homeworkService.deleteObject(this.vm.homeworkService.homework_question,{'id': tempId}));
            }
        });

        console.log(tempHomeworkData);
        Promise.all(promises).then(value =>{
            this.getHomeworks();
            alert('Homework Edited Successfully');
            this.vm.isLoading = false;
        }),error =>{
            this.vm.isLoading = false;
        }
        
    }
}