
import { ViewHomeworkComponent } from './view-homework.component';

export class ViewHomeworkServiceAdapter {

    vm : any;
    constructor() {}

    // Data

    initializeAdapter(vm: ViewHomeworkComponent): void {
        this.vm = vm;
    }


    //initialize data
    initializeData(): void {
        
        this.vm.isSessionLoading = true;
        
        this.vm.selectedStudent = this.vm.user.section.student.id;

        let student_subject_data = {
            'parentStudent': this.vm.selectedStudent,
            'parentSession': this.vm.user.activeSchool.currentSessionDbId
        }
        Promise.all([
            this.vm.subjectService.getObjectList(this.vm.subjectService.student_subject, student_subject_data),
            this.vm.subjectService.getObjectList(this.vm.subjectService.subject, {}),
            this.vm.studentService.getObjectList(this.vm.studentService.student_section, student_subject_data)
        ]).then(value =>{
            this.vm.studentClassData = value[2][0];
            this.initializeSubjectList(value[0], value[1]);
            this.vm.isSessionLoading = false;
        },error =>{
            this.vm.isSessionLoading = false;
        })

        
    }

    initializeSubjectList(studentSubjectList: any, subjectList: any): any{
        if(studentSubjectList.length == 0){
            return ;
        }
        this.vm.subjectList = [];
        studentSubjectList.forEach(subject =>{
            let tempSubject = subjectList.find(subjects => subjects.id == subject.parentSubject);
            let tempData = {
                'dbId': tempSubject.id,
                'name': tempSubject.name,
            }
            this.vm.subjectList.push(tempData);
        })
        this.vm.selectedSubject = this.vm.subjectList[0];
    }

    getHomeworks():any{

        this.vm.showContent = true;
        this.vm.isLoading = true;
        this.vm.isSubmitting = false;
        this.vm.homeworkList = [];
        let subject_homework_data = {
            'parentClassSubject__parentSubject': this.vm.selectedSubject.dbId,
            'parentClassSubject__parentSession': this.vm.user.activeSchool.currentSessionDbId,
            'parentClassSubject__parentSchool' : this.vm.user.activeSchool.dbId,
            'parentClassSubject__parentClass' : this.vm.studentClassData.parentClass,
            'parentClassSubject__parentDivision' : this.vm.studentClassData.parentDivision,
        }

        Promise.all([
            this.vm.homeworkService.getObjectList(this.vm.homeworkService.homeworks, subject_homework_data),
        ]).then(value =>{
            let homeworkIdList = [];
            value[0].forEach(homework =>{
                homeworkIdList.push(homework.id);
            })
            Promise.all([
                this.vm.homeworkService.getObjectList(this.vm.homeworkService.homework_question, {'parentHomework__in': homeworkIdList}),
                this.vm.homeworkService.getObjectList(this.vm.homeworkService.homework_status, {'parentHomework__in': homeworkIdList, 'parentStudent': this.vm.selectedStudent}),
                this.vm.homeworkService.getObjectList(this.vm.homeworkService.homework_answer, {'parentHomework__in': homeworkIdList, 'parentStudent': this.vm.selectedStudent}),
            ]).then(homeworkDetailValue =>{
                this.initializeHomeworkList(value[0], homeworkDetailValue[0], homeworkDetailValue[1], homeworkDetailValue[2]);
                this.vm.isLoading = false;
            },error =>{
                this.vm.isLoading = false;
            })
        },error =>{
            this.vm.isLoading = false;
        })
    }

    initializeHomeworkList(homeworkList: any, homeworkQuestionList: any, homeworkStatusList: any, homeworkAnswerList: any):any{
        this.vm.homeworkList = [];
        homeworkList.forEach(homework =>{
            let tempStatus = homeworkStatusList.find(homeworks => homeworks.parentHomework == homework.id);
            let tempData = {
                'homeworkId': homework.id,
                'homeworkName': homework.homeworkName,
                'startDate': homework.startDate,
                'startTime': homework.startTime,
                'endDate': homework.endDate,
                'endTime': homework.endTime,
                'homeworkText': homework.homeworkText,
                'statusDbId': tempStatus.id,
                'homeworkStatus': tempStatus.homeworkStatus,
                'submissionDate': tempStatus.submissionDate,
                'submissionTime': tempStatus.submissionTime,
                'homeworkRemark': tempStatus.remark,
                'answerText': tempStatus.answerText,
                'questionImages': [],
                'answerImages': [],
            }
            homeworkQuestionList.forEach(image =>{
                if(image.parentHomework == homework.id){
                    tempData.questionImages.push(image);
                }
            });
            
            homeworkAnswerList.forEach(image =>{
                if(image.parentHomework == homework.id){
                    tempData.answerImages.push(image);
                }
            });
            this.vm.homeworkList.push(tempData);
        });
        this.vm.homeworkList.forEach(homework =>{
            homework.questionImages.sort((a,b) => a.orderNumber < b.orderNumber ? -1 : a.orderNumber > b.orderNumber ? 1 : 0);
            homework.answerImages.sort((a,b) => a.orderNumber < b.orderNumber ? -1 : a.orderNumber > b.orderNumber ? 1 : 0);
        })
        this.vm.homeworkList.sort((a,b) => a.homeworkId > b.homeworkId ? -1 : a.homeworkId < b.homeworkId ? 1 : 0)
    }

    submitHomework(homework: any): any{

        this.vm.isSubmitting = false;
        this.vm.isLoading = true;
        let currentDate = new Date();
        let submissionDate = this.vm.formatDate(currentDate, '');
        let submissionTime = this.vm.formatTime(currentDate);

        let tempStatus = {
            'id': homework.statusDbId,
            'submissionDate': submissionDate,
            'submissionTime': submissionTime,
            'homeworkStatus': 'SUBMITTED',
            'answerText': homework.answerText,
        }
        const service_list = [];
        service_list.push(this.vm.homeworkService.partiallyUpdateObject(this.vm.homeworkService.homework_status, tempStatus))
        let index = 0;
        homework.answerImages.forEach(image =>{
            let tempImage = homework.previousAnswerImages.find(images => images.answerImage == image.answerImage);
            
            if(tempImage == undefined){
                let tempData = {
                    orderNumber: index,
                    parentHomework: homework.homeworkId,
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
                let tempIndex = homework.previousAnswerImages.indexOf(tempImage);
                homework.previousAnswerImages.splice(tempIndex, 1);
            }
            index = index + 1;
        })
        
        homework.previousAnswerImages.forEach(image =>{
            service_list.push(this.vm.homeworkService.deleteObject(this.vm.homeworkService.homework_answer, {'id':image.id}));
        });
        Promise.all(service_list).then(value =>{
            console.log(value);
            this.vm.populateSubmittedHomework(value);
            alert('Homework Answer Recorded Successfully');
            this.vm.isLoading = false;
        },error =>{
            this.vm.isLoading = false;
        })
    }


}