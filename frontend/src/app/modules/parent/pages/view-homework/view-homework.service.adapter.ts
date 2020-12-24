
import { elementAt } from 'rxjs/operators';
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
    //initialize data
    initializeData(): void {
        
        this.classSubjectList = [];
        this.subjectList = [];
        this.vm.isSessionLoading = true;
        this.vm.completedHomeworkList = [];
        this.vm.isLoadingCheckedHomeworks = true;
        this.vm.isLoadingSubmittedHomeworks = true;
        let count = this.vm.completedHomeworkList.length;
        
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
            let resubmission_homework_data = {
                'parentStudent': this.vm.selectedStudent,
                'parentHomework__parentClassSubject__parentSession': this.vm.user.activeSchool.currentSessionDbId,
                'parentHomework__parentClassSubject__parentSchool' : this.vm.user.activeSchool.dbId,
                'parentHomework__parentClassSubject__parentClass' : this.vm.studentClassData.parentClass,
                'parentHomework__parentClassSubject__parentDivision' : this.vm.studentClassData.parentDivision,
                'homeworkStatus': 'ASKED FOR RESUBMISSION',
            }
            let given_homework_data = {
                'parentStudent': this.vm.selectedStudent,
                'parentHomework__parentClassSubject__parentSession': this.vm.user.activeSchool.currentSessionDbId,
                'parentHomework__parentClassSubject__parentSchool' : this.vm.user.activeSchool.dbId,
                'parentHomework__parentClassSubject__parentClass' : this.vm.studentClassData.parentClass,
                'parentHomework__parentClassSubject__parentDivision' : this.vm.studentClassData.parentDivision,
                'homeworkStatus': 'GIVEN',
            }
            let checked_homework_data = {
                'parentStudent': this.vm.selectedStudent,
                'parentHomework__parentClassSubject__parentSession': this.vm.user.activeSchool.currentSessionDbId,
                'parentHomework__parentClassSubject__parentSchool' : this.vm.user.activeSchool.dbId,
                'parentHomework__parentClassSubject__parentClass' : this.vm.studentClassData.parentClass,
                'parentHomework__parentClassSubject__parentDivision' : this.vm.studentClassData.parentDivision,
                'homeworkStatus': 'CHECKED',
                'korangle__count': this.vm.checkedHomeworkCount.toString() + ',' + (this.vm.checkedHomeworkCount + this.vm.loadingCount).toString(),
                'korangle__order': '-parentHomework',
            }

            let submitted_homework_data = {
                'parentStudent': this.vm.selectedStudent,
                'parentHomework__parentClassSubject__parentSession': this.vm.user.activeSchool.currentSessionDbId,
                'parentHomework__parentClassSubject__parentSchool' : this.vm.user.activeSchool.dbId,
                'parentHomework__parentClassSubject__parentClass' : this.vm.studentClassData.parentClass,
                'parentHomework__parentClassSubject__parentDivision' : this.vm.studentClassData.parentDivision,
                'homeworkStatus': 'SUBMITTED',
                'korangle__count': this.vm.submittedHomeworkCount.toString() + ',' + (this.vm.submittedHomeworkCount + this.vm.loadingCount).toString(),
                'korangle__order': '-parentHomework',
            }
            let class_subject_homework_data = {
                'parentSession': this.vm.user.activeSchool.currentSessionDbId,
                'parentSchool' : this.vm.user.activeSchool.dbId,
                'parentClass' : this.vm.studentClassData.parentClass,
                'parentDivision' : this.vm.studentClassData.parentDivision,
            }
            Promise.all([
                this.vm.homeworkService.getObjectList(this.vm.homeworkService.homework_status, resubmission_homework_data),
                this.vm.homeworkService.getObjectList(this.vm.homeworkService.homework_status, given_homework_data),
                this.vm.subjectService.getObjectList(this.vm.subjectService.class_subject, class_subject_homework_data),
                
                this.vm.homeworkService.getObjectList(this.vm.homeworkService.homework_status, checked_homework_data),
                this.vm.homeworkService.getObjectList(this.vm.homeworkService.homework_status, submitted_homework_data),
        
            ]).then(secondValue =>{
                this.vm.submittedHomeworkCount = secondValue[4].length;
                this.vm.checkedHomeworkCount = secondValue[3].length;
                this.classSubjectList = secondValue[2];
                this.vm.isLoadingSubmittedHomeworks = false;
                this.vm.isLoadingCheckedHomeworks = false;
                if((secondValue[3].length + secondValue[4].length) < this.vm.loadingCount){
                    this.vm.loadMoreHomework = false;
                }
                console.log(secondValue);
                let pendingHomeworkIdList = [];
                secondValue[0].forEach(element =>{
                    pendingHomeworkIdList.push(element.parentHomework);
                })
                secondValue[1].forEach(element =>{
                    pendingHomeworkIdList.push(element.parentHomework);
                })

                let completedHomeworkIdList = [];
                secondValue[3].forEach(element =>{
                    completedHomeworkIdList.push(element.parentHomework);
                })
                secondValue[4].forEach(element =>{
                    completedHomeworkIdList.push(element.parentHomework);
                })


                let homework_data = {
                    'id__in': pendingHomeworkIdList,
                }

                let completed_homework_data = {
                    'id__in': completedHomeworkIdList,
                }
                Promise.all([
                    this.vm.homeworkService.getObjectList(this.vm.homeworkService.homeworks, homework_data),
                    this.vm.homeworkService.getObjectList(this.vm.homeworkService.homeworks, completed_homework_data),
                ]).then(thirdValue =>{
                    console.log(thirdValue);
                    this.initializePendingHomeworkList(thirdValue[0], secondValue[1], secondValue[0], this.classSubjectList, this.subjectList);
                    this.populateCompletedHomeworkList(thirdValue[1], secondValue[3], secondValue[4], this.classSubjectList, this.subjectList);
                    this.vm.isSessionLoading = false;

                })
            })
            // this.initializeSubjectList(firstValue[0], firstValue[1]);
        },error =>{
            this.vm.isSessionLoading = false;
        })

        
    }

    

    initializePendingHomeworkList(homeworkList: any, givenHomeworkList: any, resubmitHomeworkList: any, classSubjectList: any, subjectList: any): any{
        this.vm.pendingHomeworkList = [];
        this.vm.subjectList = [];
        let all_subject = {
            id: -1,
            name: 'All',
        }
        this.vm.subjectList.push(all_subject);
        homeworkList.forEach(homework =>{
            let currentHomeworkStatus = givenHomeworkList.find(homeworks => homeworks.parentHomework == homework.id);
            if(currentHomeworkStatus == undefined){
                currentHomeworkStatus = resubmitHomeworkList.find(homeworks => homeworks.parentHomework == homework.id);
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
        this.vm.pendingHomeworkList.sort((a,b) => a.dbId < b.dbId ? -1 : a.dbId > b.dbId ? 1 : 0);
        
    }

    populateCompletedHomeworkList(homeworkList: any, checkedHomeworkList: any, submittedHomeworkList: any, classSubjectList: any, subjectList: any): any{
        // this.vm.pendingHomeworkList = [];
        homeworkList.forEach(homework =>{
            let currentHomeworkStatus = checkedHomeworkList.find(homeworks => homeworks.parentHomework == homework.id);
            if(currentHomeworkStatus == undefined){
                currentHomeworkStatus = submittedHomeworkList.find(homeworks => homeworks.parentHomework == homework.id);
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
            this.vm.completedHomeworkList.push(tempHomework);
        })
        // this.vm.pendingHomeworkList.sort((a,b) => a.dbId < b.dbId ? -1 : a.dbId > b.dbId ? 1 : 0);
        
    }

    loadMoreHomeworks(): any{
        let count = this.vm.completedHomeworkList.length;

        let checked_homework_data = {
            'parentStudent': this.vm.selectedStudent,
            'parentHomework__parentClassSubject__parentSession': this.vm.user.activeSchool.currentSessionDbId,
            'parentHomework__parentClassSubject__parentSchool' : this.vm.user.activeSchool.dbId,
            'parentHomework__parentClassSubject__parentClass' : this.vm.studentClassData.parentClass,
            'parentHomework__parentClassSubject__parentDivision' : this.vm.studentClassData.parentDivision,
            'homeworkStatus': 'CHECKED',
            'korangle__count': this.vm.checkedHomeworkCount.toString() + ',' + (this.vm.checkedHomeworkCount + this.vm.loadingCount).toString(),
            'korangle__order': '-parentHomework',
        }

        let submitted_homework_data = {
            'parentStudent': this.vm.selectedStudent,
            'parentHomework__parentClassSubject__parentSession': this.vm.user.activeSchool.currentSessionDbId,
            'parentHomework__parentClassSubject__parentSchool' : this.vm.user.activeSchool.dbId,
            'parentHomework__parentClassSubject__parentClass' : this.vm.studentClassData.parentClass,
            'parentHomework__parentClassSubject__parentDivision' : this.vm.studentClassData.parentDivision,
            'homeworkStatus': 'SUBMITTED',
            'korangle__count': this.vm.submittedHomeworkCount.toString() + ',' + (this.vm.submittedHomeworkCount + this.vm.loadingCount).toString(),
            'korangle__order': '-parentHomework',
        }

        this.vm.isLoadingCheckedHomeworks = true;
        this.vm.isLoadingSubmittedHomeworks = true;

        Promise.all([
            this.vm.homeworkService.getObjectList(this.vm.homeworkService.homework_status, checked_homework_data),
            this.vm.homeworkService.getObjectList(this.vm.homeworkService.homework_status, submitted_homework_data),
        ]).then(value => {
            this.vm.submittedHomeworkCount+= value[1].length;
            this.vm.checkedHomeworkCount+= value[0].length;
            console.log(value);
            let completedHomeworkIdList = [];
            value[0].forEach(element =>{
                completedHomeworkIdList.push(element.parentHomework);
            })
            value[1].forEach(element =>{
                completedHomeworkIdList.push(element.parentHomework);
            })
            
            let completed_homework_data = {
                'id__in': completedHomeworkIdList,
            }
            if((value[0].length + value[1].length) < this.vm.loadingCount){
                this.vm.loadMoreHomework = false;
            }
            Promise.all([
                this.vm.homeworkService.getObjectList(this.vm.homeworkService.homeworks, completed_homework_data),
            ]).then(secondValue =>{
                // console.log(thirdValue);
                this.populateCompletedHomeworkList(secondValue[0], value[0], value[1], this.classSubjectList, this.subjectList);
                this.vm.isSessionLoading = false;
                
            this.vm.isLoadingCheckedHomeworks = false;
            this.vm.isLoadingSubmittedHomeworks = false;

            })

        }, error => {
            this.vm.isLoadingCheckedHomeworks = false;
            this.vm.isLoadingSubmittedHomeworks = false;

        });
    }


    submitHomework(): any{

        this.vm.isSubmitting = false;
        this.vm.isSessionLoading = true;
        let currentDate = new Date();
        let submissionDate = this.vm.formatDate(currentDate, '');
        let submissionTime = this.vm.formatTime(currentDate);

        let tempStatus = {
            'id': this.vm.toSubmitHomework.statusDbId,
            'submissionDate': submissionDate,
            'submissionTime': submissionTime,
            'homeworkStatus': 'SUBMITTED',
            'answerText': this.vm.toSubmitHomework.answerText,
        } 
        const service_list = [];
        service_list.push(this.vm.homeworkService.partiallyUpdateObject(this.vm.homeworkService.homework_status, tempStatus))
        let index = 0;
        this.vm.toSubmitHomework.answerImages.forEach(image =>{
            let tempImage = this.vm.toSubmitHomework.previousAnswerImages.find(images => images.answerImage == image.answerImage);
            
            if(tempImage == undefined){
                let tempData = {
                    orderNumber: index,
                    parentHomework: this.vm.toSubmitHomework.dbId,
                    parentStudent: this.vm.selectedStudent,
                    answerImage: image.answerImage,
                }
                let temp_form_data = new FormData();
                const layout_data = { ...tempData,};
                Object.keys(layout_data).forEach(key => {
                    if (key === 'answerImage' ) {
                        temp_form_data.append(key, this.vm.dataURLtoFile(layout_data[key], 'answerImage' + index +'.jpeg'));
                    } else {
                        temp_form_data.append(key, layout_data[key]);
                    }
                });
                service_list.push(this.vm.homeworkService.createObject(this.vm.homeworkService.homework_answer, temp_form_data));
            }
            else{
                let tempData ={
                    id: tempImage.id,
                    orderNumber: index,
                }
                service_list.push(this.vm.homeworkService.partiallyUpdateObject(this.vm.homeworkService.homework_answer, tempData));
                let tempIndex = this.vm.toSubmitHomework.previousAnswerImages.indexOf(tempImage);
                this.vm.toSubmitHomework.previousAnswerImages.splice(tempIndex, 1);
            }
            index = index + 1;
        })
        
        this.vm.toSubmitHomework.previousAnswerImages.forEach(image =>{
            service_list.push(this.vm.homeworkService.deleteObject(this.vm.homeworkService.homework_answer, {'id':image.id}));
        });
        Promise.all(service_list).then(value =>{
            console.log(value);
            // this.vm.populateSubmittedHomework(value);
            alert('Homework Answer Recorded Successfully');
            this.vm.isSessionLoading = false;
        },error =>{
            this.vm.isSessionLoading = false;
        })
    }


    getHomeworkDetails(homework: any){
        this.vm.isHomeworkLoading = true;
        this.vm.currentHomeworkImages = [];
        this.vm.currentHomeworkAnswerImages = [];
        Promise.all([
            this.vm.homeworkService.getObjectList(this.vm.homeworkService.homework_question,{'parentHomework': homework.dbId}),
            this.vm.homeworkService.getObjectList(this.vm.homeworkService.homework_answer,{'parentHomework': homework.dbId, 'parentStudent': this.vm.selectedStudent}),
            
        ]).then(value =>{
            value[0].forEach(element =>{
                this.vm.currentHomeworkImages.push(element);
            })
            value[1].forEach(element =>{
                this.vm.currentHomeworkAnswerImages.push(element);
            })
            this.vm.currentHomeworkImages.sort((a,b) => a.orderNumber < b.orderNumber ? -1 : a.orderNumber > b.orderNumber ? 1 : 0);
            this.vm.currentHomeworkAnswerImages.sort((a,b) => a.orderNumber < b.orderNumber ? -1 : a.orderNumber > b.orderNumber ? 1 : 0);
        
            this.vm.isHomeworkLoading = false;
        })
    }
    
}