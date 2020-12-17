
import { Homework } from 'app/services/modules/homework/models/homework';
import { CheckHomeworkComponent } from './check-homework.component';

export class CheckHomeworkServiceAdapter {

    vm: CheckHomeworkComponent;

    constructor() {}

    initializeAdapter(vm: CheckHomeworkComponent): void {
        this.vm = vm;
    }

    initializeData(): void {

        let request_homework_list = {
            'parentClassSubject__parentSchool' : this.vm.user.activeSchool.dbId, 
            'parentClassSubject__parentEmployee': this.vm.user.activeSchool.employeeId,
            'parentClassSubject__parentSession': this.vm.user.activeSchool.currentSessionDbId
        }

        let request_class_subject_list = {
            'parentSchool' : this.vm.user.activeSchool.dbId, 
            'parentEmployee': this.vm.user.activeSchool.employeeId,
            'parentSession': this.vm.user.activeSchool.currentSessionDbId
        }

        this.vm.isInitialLoading = true;

        Promise.all([
            this.vm.subjectService.getObjectList(this.vm.subjectService.subject, {}),
            this.vm.classService.getObjectList(this.vm.classService.classs, {}),
            this.vm.classService.getObjectList(this.vm.classService.division, {}),
            this.vm.homeworkService.getObjectList(this.vm.homeworkService.homeworks, request_homework_list),
            this.vm.subjectService.getObjectList(this.vm.subjectService.class_subject, request_class_subject_list),
        ]).then(value => {
            // console.log(value[0]);
            // console.log(value[4]);
            // console.log(value[3]);
            this.initialiseClassSubjectData(value[0], value[1], value[2], value[3], value[4]);
            
            this.vm.isInitialLoading =false;
        },error =>{
            this.vm.isInitialLoading =false;
        });
    }

    initialiseClassSubjectData(subjectList: any, classList: any, divisionList: any, homeworkList: any, classSectionSubjectList: any, ){
        this.vm.classSectionHomeworkList = [];
        homeworkList.forEach(homework =>{
            let tempClassSubject = classSectionSubjectList.find(classSectionSubject => classSectionSubject.id == homework.parentClassSubject);
            let tempClass = classList.find(classs => classs.id == tempClassSubject.parentClass);
            let tempDivision = divisionList.find(division => division.id == tempClassSubject.parentDivision);
            let tempSubject = subjectList.find(subject => subject.id == tempClassSubject.parentSubject);
            let currentClassSection = this.vm.classSectionHomeworkList.find(classSection => classSection.classDbId == tempClass.id && classSection.divisionDbId == tempDivision.id);
            if(currentClassSection === undefined){
                let classSection = {
                    classDbId : tempClass.id,
                    className : tempClass.name,
                    divisionDbId: tempDivision.id,
                    divisionName: tempDivision.name,
                    subjectList : [],
                }
                this.vm.classSectionHomeworkList.push(classSection);
                currentClassSection = this.vm.classSectionHomeworkList.find(classSection => classSection.classDbId == tempClass.id && classSection.divisionDbId == tempDivision.id);
            }

            let currentSubject = currentClassSection.subjectList.find(subject => subject.dbId == tempSubject.id);
            if(currentSubject == undefined){
                let subject = {
                    dbId: tempSubject.id,
                    name: tempSubject.name,
                    homeworkList: [],
                }
                currentClassSection.subjectList.push(subject);
                currentSubject = currentClassSection.subjectList.find(subject => subject.dbId == tempSubject.id);
            }
            currentSubject.homeworkList.push(homework);
            
        })

        this.vm.classSectionHomeworkList.forEach(classSection =>{
                classSection.subjectList.forEach(subject =>{
                    subject.homeworkList.sort((a, b) => a.id > b.id ? -1 : a.id < b.id ? 1 : 0);
                });
                classSection.subjectList.sort((a, b) => a.dbId < b.dbId ? -1 : a.dbId > b.dbId ? 1 : 0);
        });
        this.vm.classSectionHomeworkList.sort((a, b) => a.classDbId < b.classDbId ? -1 : a.classDbId > b.classDbId ? 1 : 0);
        this.vm.classSectionHomeworkList.sort((a, b) => a.divisionDbId < b.divisionDbId ? -1 : a.divisionDbId > b.divisionDbId ? 1 : 0);
        
        
        this.vm.selectedClassSection = this.vm.classSectionHomeworkList[0];
        this.vm.selectedSubject = this.vm.selectedClassSection.subjectList[0];
        this.vm.selectedHomework = this.vm.selectedSubject.homeworkList[0];
        
        // console.log(this.vm.selectedClassSection);
        // console.log(this.vm.selectedSubject);
        // console.log(this.vm.selectedHomework);
    }

    getHomework(): any{

        this.vm.isLoading = true;
        this.vm.studentList = [];
        this.vm.studentHomeworkList = [];
        let homework_data = {
            'parentHomework': this.vm.selectedHomework.id,
        }

        let student_section_data = {
            'parentStudent__parentSchool': this.vm.user.activeSchool.dbId,
            'parentClass': this.vm.selectedClassSection.classDbId,
            'parentDivision': this.vm.selectedClassSection.divisionDbId,
            'parentSession': this.vm.user.activeSchool.currentSessionDbId,
            'fields__korangle': 'parentStudent',
        }

        this.vm.currentHomework = {
            name: this.vm.selectedHomework.homeworkName,
            startDate: this.vm.selectedHomework.startDate,
            startTime: this.vm.selectedHomework.startTime,
            endDate: this.vm.selectedHomework.endDate,
            endTime: this.vm.selectedHomework.endTime,
            text: this.vm.selectedHomework.homeworkText,
            images: [],
        }

        Promise.all([
            this.vm.homeworkService.getObjectList(this.vm.homeworkService.homework_question, homework_data),
            this.vm.studentService.getObjectList(this.vm.studentService.student_section, student_section_data),
        ]).then(value =>{
            this.vm.currentHomework.images = value[0];
            this.vm.currentHomework.images.sort((a,b) => a.orderNumber < b.orderNumber ? -1 : a.orderNumber > b.orderNumber ? 1 : 0)
            let studentIdList = [];
            value[1].forEach(student =>{
                studentIdList.push(student.parentStudent);
            });

            let student_data = {
                'id__in': studentIdList,
                'fields__korangle': 'id,name,mobileNumber',
            }
            let student_homework_data = {
                'parentHomework': this.vm.selectedHomework.id,
                'parentStudent__in': studentIdList,
            }
            Promise.all([
                this.vm.studentService.getObjectList(this.vm.studentService.student, student_data),
                this.vm.homeworkService.getObjectList(this.vm.homeworkService.homework_status, student_homework_data),
                this.vm.homeworkService.getObjectList(this.vm.homeworkService.homework_answer, student_homework_data),
            ]).then(value =>{
                value[0].forEach(element =>{
                    let tempData = {
                        dbId: element.id,
                        name: element.name,
                        mobileNumber: element.mobileNumber,
                        subject: this.vm.selectedSubject.name,
                        homeworkName: this.vm.selectedHomework.name,
                        deadLine: null,
                    }
                    this.vm.studentList.push(tempData);
                })
                
                this.initialiseStudentHomeworkData(value[2], value[1]);
                this.getHomeworkReport();
                this.fetchGCMDevices(this.vm.studentList);
                this.vm.isLoading = false;
            },error =>{
                this.vm.isLoading = false;
            });
        },error =>{
            this.vm.isLoading = false;
        })
    }

    initialiseStudentHomeworkData(studentHomeworkImagesList: any, studentHomeworkList: any): any{
        this.vm.studentHomeworkList = [];
        studentHomeworkList.forEach(studentHomework =>{
            let tempStudent = this.vm.studentList.find(student => student.dbId == studentHomework.parentStudent);
            console.log()
            let tempData = {
                'id': studentHomework.id, 
                'studentName': tempStudent.name,
                'parentStudent': studentHomework.parentStudent,
                'parentHomework': studentHomework.parentHomework,
                'status': studentHomework.homeworkStatus,
                'text': studentHomework.answerText,
                'remark': studentHomework.remark,
                'submissionDate': studentHomework.submissionDate,
                'submissionTime': studentHomework.submissionTime,
                'images': [],
                'isStatusLoading': false,
            }
            this.vm.studentHomeworkList.push(tempData);
            let currentStudentHomework = this.vm.studentHomeworkList.find(student => student.parentStudent == studentHomework.parentStudent);
            
            studentHomeworkImagesList.forEach(image =>{
                if(image.parentStudent == currentStudentHomework.parentStudent){
                    currentStudentHomework.images.push(image);
                }
            })
        });

    }

    getHomeworkReport(): any{
        let given = 0;
        let submitted = 0;
        let checked = 0;
        let resubmission = 0;
        this.vm.studentHomeworkList.forEach(student =>{
            if(student.status == this.vm.HOMEWORK_STATUS[0]){
                given = given + 1;
            }
            else if(student.status == this.vm.HOMEWORK_STATUS[1]){
                submitted = submitted + 1;
            }
            else if(student.status == this.vm.HOMEWORK_STATUS[2]){
                checked = checked + 1;
            }
            else{
                resubmission = resubmission + 1;
            }
        })
        this.vm.homeworkReport = {
            'given': given,
            'submitted': submitted,
            'checked': checked,
            'resubmission': resubmission,
        }
    }
    changeStudentHomeworkStatus(studentHomework: any){

        studentHomework.isStatusLoading = true;
        let tempData = {
            'id': studentHomework.id,
            'homeworkStatus': studentHomework.status,
        }
        Promise.all([
            this.vm.homeworkService.partiallyUpdateObject(this.vm.homeworkService.homework_status, tempData),
        ]).then(value =>{
            this.getHomeworkReport();
            studentHomework.isStatusLoading = false;
        },error =>{
            studentHomework.isStatusLoading = false;
        })
    }

    changeStudentRemark(studentHomework): any{

        if(studentHomework.remark==''){
            return ;
        }

        studentHomework.isStatusLoading = true;
        let tempData = {
            'id': studentHomework.id,
            'remark': studentHomework.remark,
        }
        Promise.all([
            this.vm.homeworkService.partiallyUpdateObject(this.vm.homeworkService.homework_status, tempData),
        ]).then(value =>{
            studentHomework.isStatusLoading = false;
        },error =>{
            studentHomework.isStatusLoading = false;
        })
    }

    fetchGCMDevices: any = (studentList: any) => {
        // console.log(studentList);
        this.vm.isLoading = true;
        const service_list = [];
        const iterationCount = Math.ceil(studentList.length / this.vm.STUDENT_LIMITER);
        let loopVariable = 0;

        while (loopVariable < iterationCount) {
            const mobile_list = studentList.filter(item => item.mobileNumber).map(obj => obj.mobileNumber.toString());
            const gcm_data = {
                'user__username__in': mobile_list.slice(
                    this.vm.STUDENT_LIMITER * loopVariable, this.vm.STUDENT_LIMITER * (loopVariable + 1)
                ),
                'active': 'true__boolean',
            }
            // console.log(gcm_data);
            const user_data = {
                'fields__korangle': 'username,id',
                'username__in': mobile_list.slice(this.vm.STUDENT_LIMITER * loopVariable, this.vm.STUDENT_LIMITER * (loopVariable + 1)),
            };
            // console.log(user_data);
            service_list.push(this.vm.notificationService.getObjectList(this.vm.notificationService.gcm_device, gcm_data));
            service_list.push(this.vm.userService.getObjectList(this.vm.userService.user, user_data));
            // console.log(service_list);
            loopVariable = loopVariable + 1;
        }

        Promise.all(service_list).then((value) => {
            let temp_gcm_list = [];
            let temp_user_list = [];
            let loopVariable = 0;
            while (loopVariable < iterationCount) {
                temp_gcm_list = temp_gcm_list.concat(value[loopVariable * 2]);
                temp_user_list = temp_user_list.concat(value[loopVariable * 2 + 1]);
                loopVariable = loopVariable + 1;
            }

            const notif_usernames = temp_user_list.filter(user => {
                return temp_gcm_list.find(item => {
                    return item.user == user.id;
                }) != undefined;
            })
            // Storing because they're used later
            this.vm.notif_usernames = notif_usernames;

            let notification_list;

            notification_list = studentList.filter(obj => {
                return notif_usernames.find(user => {
                    return user.username == obj.mobileNumber;
                }) != undefined;
            });
            studentList.forEach((item, i) => {
                item.notification = false;
            })
            notification_list.forEach((item, i) => {
                item.notification = true;
            })


            this.vm.isLoading = false;
        })
    }



}