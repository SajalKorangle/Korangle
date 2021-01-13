
import { CommonFunctions } from '../../../../classes/common-functions.js';
import { ViewHomeworkComponent } from './view-homework.component';

export class ViewHomeworkServiceAdapter {

    vm : any;
    constructor() {}

    // Data

    initializeAdapter(vm: ViewHomeworkComponent): void {
        this.vm = vm;
    }

    classSubjectList: any;
    subjectList: any;
    completedHomeworksIdList = [];
    count = 0;
    //initialize data
    initializeData(): void {
        
        this.classSubjectList = [];
        this.subjectList = [];
        this.vm.isSessionLoading = true;
        this.vm.completedHomeworkList = [];
        this.vm.isLoadingCheckedHomeworks = true;
        this.vm.isLoadingSubmittedHomeworks = true;
        this.vm.pendingHomeworkList = [];
        this.vm.subjectList = [];
        let all_subject = {
            id: -1,
            name: 'All',
        }
        this.vm.subjectList.push(all_subject);
        
        this.vm.selectedStudent = this.vm.user.section.student.id;

        let student_subject_data = {
            'parentStudent': this.vm.selectedStudent,
            'parentSession': this.vm.user.activeSchool.currentSessionDbId
        }

        Promise.all([
            this.vm.subjectService.getObjectList(this.vm.subjectService.subject, {}),
            this.vm.studentService.getObjectList(this.vm.studentService.student_section, student_subject_data),
            
        ]).then(firstValue =>{
            this.subjectList = firstValue[0];
            this.vm.studentClassData = firstValue[1][0];

            let current_class_homework_question_data = {
                'parentClassSubject__parentSession': this.vm.user.activeSchool.currentSessionDbId,
                'parentClassSubject__parentSchool' : this.vm.user.activeSchool.dbId,
                'parentClassSubject__parentClass' : this.vm.studentClassData.parentClass,
                'parentClassSubject__parentDivision' : this.vm.studentClassData.parentDivision,
                'fields__korangle': 'id',
            }

            let student_total_submitted_homeworks = {
                'parentStudent': this.vm.selectedStudent,
                'parentHomeworkQuestion__parentClassSubject__parentSession': this.vm.user.activeSchool.currentSessionDbId,
                'parentHomeworkQuestion__parentClassSubject__parentSchool' : this.vm.user.activeSchool.dbId,
                'parentHomeworkQuestion__parentClassSubject__parentClass' : this.vm.studentClassData.parentClass,
                'parentHomeworkQuestion__parentClassSubject__parentDivision' : this.vm.studentClassData.parentDivision,
                'homeworkStatus': 'SUBMITTED',
                'fields__korangle': 'parentHomeworkQuestion'
            }

            let student_total_checked_homeworks = {
                'parentStudent': this.vm.selectedStudent,
                'parentHomeworkQuestion__parentClassSubject__parentSession': this.vm.user.activeSchool.currentSessionDbId,
                'parentHomeworkQuestion__parentClassSubject__parentSchool' : this.vm.user.activeSchool.dbId,
                'parentHomeworkQuestion__parentClassSubject__parentClass' : this.vm.studentClassData.parentClass,
                'parentHomeworkQuestion__parentClassSubject__parentDivision' : this.vm.studentClassData.parentDivision,
                'homeworkStatus': 'CHECKED',
                'fields__korangle': 'parentHomeworkQuestion'
            }

            let resubmission_homework_data = {
                'parentStudent': this.vm.selectedStudent,
                'parentHomeworkQuestion__parentClassSubject__parentSession': this.vm.user.activeSchool.currentSessionDbId,
                'parentHomeworkQuestion__parentClassSubject__parentSchool' : this.vm.user.activeSchool.dbId,
                'parentHomeworkQuestion__parentClassSubject__parentClass' : this.vm.studentClassData.parentClass,
                'parentHomeworkQuestion__parentClassSubject__parentDivision' : this.vm.studentClassData.parentDivision,
                'homeworkStatus': 'ASKED FOR RESUBMISSION',
            }
            let given_homework_data = {
                'parentStudent': this.vm.selectedStudent,
                'parentHomeworkQuestion__parentClassSubject__parentSession': this.vm.user.activeSchool.currentSessionDbId,
                'parentHomeworkQuestion__parentClassSubject__parentSchool' : this.vm.user.activeSchool.dbId,
                'parentHomeworkQuestion__parentClassSubject__parentClass' : this.vm.studentClassData.parentClass,
                'parentHomeworkQuestion__parentClassSubject__parentDivision' : this.vm.studentClassData.parentDivision,
                'homeworkStatus': 'GIVEN',
            }

            let class_subject_homework_data = {
                'parentSession': this.vm.user.activeSchool.currentSessionDbId,
                'parentSchool' : this.vm.user.activeSchool.dbId,
                'parentClass' : this.vm.studentClassData.parentClass,
                'parentDivision' : this.vm.studentClassData.parentDivision,
            }

            Promise.all([
                this.vm.homeworkService.getObjectList(this.vm.homeworkService.homework_answer, resubmission_homework_data), //0
                this.vm.homeworkService.getObjectList(this.vm.homeworkService.homework_answer, given_homework_data), //1
                this.vm.subjectService.getObjectList(this.vm.subjectService.class_subject, class_subject_homework_data), //2
                
                this.vm.homeworkService.getObjectList(this.vm.homeworkService.homework_question, current_class_homework_question_data), //3
                this.vm.homeworkService.getObjectList(this.vm.homeworkService.homework_answer, student_total_checked_homeworks), //4
                this.vm.homeworkService.getObjectList(this.vm.homeworkService.homework_answer, student_total_submitted_homeworks), //5
        
            ]).then(secondValue =>{
                this.classSubjectList = secondValue[2];
                let pendingHomeworkIdList = [];
                
                secondValue[0].forEach(element =>{
                    pendingHomeworkIdList.push(element.parentHomeworkQuestion);
                })
                secondValue[1].forEach(element =>{
                    pendingHomeworkIdList.push(element.parentHomeworkQuestion);
                })

                secondValue[4].forEach(homeworkId =>{
                    this.completedHomeworksIdList.push(homeworkId.parentHomeworkQuestion);
                })
                secondValue[5].forEach(homeworkId =>{
                    this.completedHomeworksIdList.push(homeworkId.parentHomeworkQuestion);
                })
                this.completedHomeworksIdList.sort((a,b) => {return a-b});
                this.completedHomeworksIdList.reverse();
                if((secondValue[3].length + secondValue[4].length) < this.vm.loadingCount){
                    this.vm.loadMoreHomework = false;
                }

                let completedHomeworkIdList = [];
                let tempCount = 0;
                for(let i = this.count; i < this.completedHomeworksIdList.length; i++){
                    completedHomeworkIdList.push(this.completedHomeworksIdList[i]);
                    tempCount = tempCount + 1;
                    if(tempCount >= 10){
                        break;
                    }
                }
                if(tempCount < 10){
                    this.vm.loadMoreHomework = false;
                }
                else{
                    this.count = this.count + 10;
                }

                let homework_data = {
                    'id__in': pendingHomeworkIdList,
                }

                let completed_homework_data = {
                    'id__in': completedHomeworkIdList,
                }

                let completed_homework_student_data = {
                    'parentHomeworkQuestion__in': completedHomeworkIdList,
                    'parentStudent': this.vm.selectedStudent,
                }

                let unassigned_homework_id_list = [];
                secondValue[3].forEach(element =>{
                    let tempHomework = this.completedHomeworksIdList.find(a => a==element.id);
                    if(tempHomework == undefined){
                        tempHomework = pendingHomeworkIdList.find(a => a==element.id);
                        if(tempHomework == undefined){
                            unassigned_homework_id_list.push(element.id);
                        }
                    }
                })
                console.log(unassigned_homework_id_list);

                Promise.all([
                    this.vm.homeworkService.getObjectList(this.vm.homeworkService.homework_question, homework_data),
                    this.vm.homeworkService.getObjectList(this.vm.homeworkService.homework_question, completed_homework_data),
                    this.vm.homeworkService.getObjectList(this.vm.homeworkService.homework_answer, completed_homework_student_data)
                ]).then(thirdValue =>{
                    this.initializePendingHomeworkList(thirdValue[0], secondValue[1], secondValue[0], this.classSubjectList, this.subjectList);
                    this.populateCompletedHomeworkList(thirdValue[1], thirdValue[2], this.classSubjectList, this.subjectList);
                    if(unassigned_homework_id_list.length > 0){
                        let createList = [];
                        unassigned_homework_id_list.forEach(element =>{
                            let tempData = {
                                'parentStudent': this.vm.selectedStudent,
                                'parentHomeworkQuestion': element,
                                'homeworkStatus': 'GIVEN',
                            }
                            createList.push(tempData);
                        })
                        let homework_data = {
                            'id__in': unassigned_homework_id_list
                        }
                        Promise.all([
                            this.vm.homeworkService.getObjectList(this.vm.homeworkService.homework_question, homework_data),
                            this.vm.homeworkService.createObjectList(this.vm.homeworkService.homework_answer, createList),
                        ]).then( cValue =>{
                            console.log(cValue);
                            this.initializePendingHomeworkList(cValue[0], cValue[1], [], this.classSubjectList, this.subjectList);
                        })
                    }
                    this.vm.isSessionLoading = false;

                })
            })
        },error =>{
            this.vm.isSessionLoading = false;
        })

        
    }

    

    initializePendingHomeworkList(homeworkList: any, givenHomeworkList: any, resubmitHomeworkList: any, classSubjectList: any, subjectList: any): any{
        homeworkList.forEach(homework =>{
            let currentHomeworkStatus = givenHomeworkList.find(homeworks => homeworks.parentHomeworkQuestion == homework.id);
            if(currentHomeworkStatus == undefined){
                currentHomeworkStatus = resubmitHomeworkList.find(homeworks => homeworks.parentHomeworkQuestion == homework.id);
            }
            let currentClassSubject = classSubjectList.find(classSubject => classSubject.id == homework.parentClassSubject);
            let currentSubject = subjectList.find(subject => subject.id == currentClassSubject.parentSubject);
            if(this.vm.subjectList.find(subject => subject.name == currentSubject.name) == undefined){
                this.vm.subjectList.push(currentSubject);
            }
            let tempHomework = {
                dbId: homework.id,
                homeworkName: homework.homeworkName,
                startDate: homework.startDate,
                endDate: homework.endDate,
                startTime: homework.startTime,
                endTime: homework.endTime,
                homeworkText: homework.homeworkText,
                subjectDbId: currentSubject.id,
                subjectName: currentSubject.name,
                statusDbId: currentHomeworkStatus.id,
                homeworkStatus: currentHomeworkStatus.homeworkStatus,
                submissionDate: currentHomeworkStatus.submissionDate,
                submissionTime: currentHomeworkStatus.submissionTime,
                answerText: currentHomeworkStatus.answerText,
                homeworkRemark: currentHomeworkStatus.remark,
            }
            this.vm.pendingHomeworkList.push(tempHomework);
        })
        this.vm.selectedSubject = this.vm.subjectList[0];
        this.vm.pendingHomeworkList.sort((a,b) => a.dbId < b.dbId ? 1 : a.dbId > b.dbId ? -1 : 0);
        
    }

    populateCompletedHomeworkList(homeworkList: any, homeworkDetailsList: any, classSubjectList: any, subjectList: any): any{
        homeworkList.forEach(homework =>{
            let currentHomeworkStatus = homeworkDetailsList.find(homeworks => homeworks.parentHomeworkQuestion == homework.id);
            let currentClassSubject = classSubjectList.find(classSubject => classSubject.id == homework.parentClassSubject);
            let currentSubject = subjectList.find(subject => subject.id == currentClassSubject.parentSubject);
            if(this.vm.subjectList.find(subject => subject.name == currentSubject.name) == undefined){
                this.vm.subjectList.push(currentSubject);
            }
            let tempHomework = {
                dbId: homework.id,
                homeworkName: homework.homeworkName,
                startDate: homework.startDate,
                endDate: homework.endDate,
                startTime: homework.startTime,
                endTime: homework.endTime,
                homeworkText: homework.homeworkText,
                subjectDbId: currentSubject.id,
                subjectName: currentSubject.name,
                statusDbId: currentHomeworkStatus.id,
                homeworkStatus: currentHomeworkStatus.homeworkStatus,
                submissionDate: currentHomeworkStatus.submissionDate,
                submissionTime: currentHomeworkStatus.submissionTime,
                answerText: currentHomeworkStatus.answerText,
                homeworkRemark: currentHomeworkStatus.remark,
            }
            this.vm.completedHomeworkList.push(tempHomework);
        })
        this.vm.completedHomeworkList.sort((a,b) => a.dbId < b.dbId ? 1 : a.dbId > b.dbId ? -1 : 0);
        
    }

    loadMoreHomeworks(): any{

        if(this.vm.loadMoreHomework = false){
            return ;
        }
        this.vm.isLoadingHomeworks = true;
        
        let completedHomeworkIdList = [];
        let tempCount = 0;
        for(let i = this.count; i < this.completedHomeworksIdList.length; i++){
            completedHomeworkIdList.push(this.completedHomeworksIdList[i]);
            tempCount = tempCount + 1;
            if(tempCount >= 10){
                break;
            }
        }
        if(tempCount < 10){
            this.vm.loadMoreHomework = false;
        }
        else{
            this.count = this.count + 10;
        }

        let completed_homework_data = {
            'id__in': completedHomeworkIdList,
        }

        let completed_homework_student_data = {
            'parentHomeworkQuestion__in': completedHomeworkIdList,
            'parentStudent': this.vm.selectedStudent,
        }

        Promise.all([
            // this.vm.homeworkService.getObjectList(this.vm.homeworkService.homework_answer, checked_homework_data),
            // this.vm.homeworkService.getObjectList(this.vm.homeworkService.homework_answer, submitted_homework_data),
            this.vm.homeworkService.getObjectList(this.vm.homeworkService.homework_question, completed_homework_data),
            this.vm.homeworkService.getObjectList(this.vm.homeworkService.homework_answer, completed_homework_student_data)
        ]).then(value => {
            this.populateCompletedHomeworkList(value[0], value[1],this.classSubjectList, this.subjectList);

        }, error => {
            this.vm.isLoadingHomeworks = false;

        });
    }
    
    getHomeworkDetails(homework: any){
        this.vm.isHomeworkLoading = true;
        this.vm.currentHomeworkImages = [];
        this.vm.currentHomeworkAnswerImages = [];
        Promise.all([
            this.vm.homeworkService.getObjectList(this.vm.homeworkService.homework_question_image,{'parentHomeworkQuestion': homework.dbId}),
            this.vm.homeworkService.getObjectList(this.vm.homeworkService.homework_answer_image,{'parentHomeworkAnswer__parentHomeworkQuestion': homework.dbId, 'parentHomeworkAnswer__parentStudent': this.vm.selectedStudent}),
            
        ]).then(value =>{
            value[0].forEach(element =>{
                this.vm.currentHomeworkImages.push(element);
            })
            value[1].forEach(element =>{
                this.vm.currentHomeworkAnswerImages.push(element);
            })
            this.vm.currentHomeworkImages.sort((a,b) => a.orderNumber < b.orderNumber ? -1 : a.orderNumber > b.orderNumber ? 1 : 0);
            this.vm.currentHomeworkAnswerImages.sort((a,b) => a.orderNumber < b.orderNumber ? -1 : a.orderNumber > b.orderNumber ? 1 : 0);
            
            if(this.vm.isMobile() == true){    
                this.vm.submitHomework(homework);
            }    
            this.vm.isHomeworkLoading = false;
            
        })
    }


    submitHomework(): any{

        if(!confirm("Click OK to submit the current Answer")) {
            return;
        }

        this.vm.isSubmitting = false;
        this.vm.isSessionLoading = true;
        let currentDate = new Date();
        let submissionDate = CommonFunctions.formatDate(currentDate, '');
        let submissionTime = CommonFunctions.formatTime(currentDate);

        let tempStatus = {
            'id': this.vm.toSubmitHomework.statusDbId,
            'submissionDate': submissionDate,
            'submissionTime': submissionTime,
            'homeworkStatus': 'SUBMITTED',
            'answerText': this.vm.toSubmitHomework.answerText,
        } 
        const service_list = [];
        service_list.push(this.vm.homeworkService.partiallyUpdateObject(this.vm.homeworkService.homework_answer, tempStatus))
        let index = 0;
        this.vm.toSubmitHomework.answerImages.forEach(image =>{
            let tempImage = this.vm.toSubmitHomework.previousAnswerImages.find(images => images.answerImage == image.answerImage);
            
            if(tempImage == undefined){
                let tempData = {
                    orderNumber: index,
                    parentHomeworkAnswer: this.vm.toSubmitHomework.statusDbId,
                    answerImage: image.answerImage,
                }
                let temp_form_data = new FormData();
                const layout_data = { ...tempData,};
                Object.keys(layout_data).forEach(key => {
                    if (key === 'answerImage' ) {
                        temp_form_data.append(key, CommonFunctions.dataURLtoFile(layout_data[key], 'answerImage' + index +'.jpeg'));
                    } else {
                        temp_form_data.append(key, layout_data[key]);
                    }
                });
                service_list.push(this.vm.homeworkService.createObject(this.vm.homeworkService.homework_answer_image, temp_form_data));
            }
            else{
                let tempData ={
                    id: tempImage.id,
                    orderNumber: index,
                }
                service_list.push(this.vm.homeworkService.partiallyUpdateObject(this.vm.homeworkService.homework_answer_image, tempData));
                let tempIndex = this.vm.toSubmitHomework.previousAnswerImages.indexOf(tempImage);
                this.vm.toSubmitHomework.previousAnswerImages.splice(tempIndex, 1);
            }
            index = index + 1;
        })
        
        this.vm.toSubmitHomework.previousAnswerImages.forEach(image =>{
            service_list.push(this.vm.homeworkService.deleteObject(this.vm.homeworkService.homework_answer_image, {'id':image.id}));
        });
        Promise.all(service_list).then(value =>{
            this.populateSubmittedHomework(value);
            alert('Homework Answer Recorded Successfully');
            this.vm.isSessionLoading = false;
        },error =>{
            this.vm.isSessionLoading = false;
        })
    }

    
    populateSubmittedHomework(homework: any): any{
        let tempHomework = this.vm.pendingHomeworkList.find(homeworks => homeworks.statusDbId == homework[0].id);;
        let submittedHomework;
        if(tempHomework == undefined){
            tempHomework = this.vm.completedHomeworkList.find(homeworks => homeworks.statusDbId == homework[0].id);
        }

        submittedHomework = JSON.parse(JSON.stringify(tempHomework));
        submittedHomework.homeworkStatus =  homework[0].homeworkStatus;
        submittedHomework.submissionDate =  homework[0].submissionDate;
        submittedHomework.submissionTime =  homework[0].submissionTime;
        submittedHomework.answerText =  homework[0].answerText;
        let tempIndex = this.vm.pendingHomeworkList.indexOf(tempHomework);
        if(tempIndex == -1){
            tempIndex = this.vm.completedHomeworkList.indexOf(tempHomework);
            this.vm.completedHomeworkList.splice(tempIndex, 1);
        }
        else{
            this.vm.pendingHomeworkList.splice(tempIndex, 1);
        }
        this.vm.completedHomeworkList.splice(0,0,submittedHomework);
        this.vm.completedHomeworkList.sort((a,b) => a.dbId < b.dbId ? 1 : a.dbId > b.dbId ? -1 : 0);
    }

}