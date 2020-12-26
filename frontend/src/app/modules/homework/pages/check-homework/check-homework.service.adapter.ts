
import { Homework } from 'app/services/modules/homework/models/homework';
import { CheckHomeworkComponent } from './check-homework.component';

export class CheckHomeworkServiceAdapter {

    vm: CheckHomeworkComponent;

    constructor() {}

    initializeAdapter(vm: CheckHomeworkComponent): void {
        this.vm = vm;
    }

    initializeData(): void {

        this.vm.isInitialLoading = true;

        this.vm.sendCheckUpdate = false;
        this.vm.sendResubmissionUpdate = false;
        this.vm.sendUpdateType = 'NULL';

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


        Promise.all([
            this.vm.subjectService.getObjectList(this.vm.subjectService.subject, {}),
            this.vm.classService.getObjectList(this.vm.classService.classs, {}),
            this.vm.classService.getObjectList(this.vm.classService.division, {}),
            this.vm.homeworkService.getObjectList(this.vm.homeworkService.homeworks, request_homework_list),
            this.vm.subjectService.getObjectList(this.vm.subjectService.class_subject, request_class_subject_list),
            this.vm.homeworkService.getObjectList(this.vm.homeworkService.homework_settings,{'parentSchool' : this.vm.user.activeSchool.dbId}),
            this.vm.smsOldService.getSMSCount({'parentSchool' : this.vm.user.activeSchool.dbId}, this.vm.user.jwt),
        ]).then(value => {
            // console.log(value[0]);
            // console.log(value[4]);
            // console.log(value[3]);
            this.vm.smsBalance = value[6];
            if(value[5].length> 0){
                this.vm.sendUpdateType = value[5][0].sentUpdateType;
                this.vm.sendCheckUpdate = value[5][0].sendCheckUpdate;
                this.vm.sendResubmissionUpdate = value[5][0].sendResubmissionUpdate;
            }
            this.initialiseClassSubjectData(value[0], value[1], value[2], value[3], value[4]);
            this.vm.isInitialLoading =false;
        },error =>{
            this.vm.isInitialLoading =false;
        });
    }

    initialiseClassSubjectData(subjectList: any, classList: any, divisionList: any, homeworkList: any, classSectionSubjectList: any, ){
        if(homeworkList.length == 0){
            return ;
        }
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
        this.vm.classSectionHomeworkList.sort((a, b) => {
            if(a.classDbId > b.classDbId){
                return 1;
            }
            else if(a.classDbId < b.classDbId){
                return -1;
            }
            else{
                if(a.divisionDbId > b.divisionDbid){
                    return 1;
                }
                else{
                    return -1;
                }
            }
        });
        
        this.vm.selectedClassSection = this.vm.classSectionHomeworkList[0];
        this.vm.selectedSubject = this.vm.selectedClassSection.subjectList[0];
        this.vm.selectedHomework = this.vm.selectedSubject.homeworkList[0];
        
        // console.log(this.vm.selectedClassSection);
        // console.log(this.vm.selectedSubject);
        // console.log(this.vm.selectedHomework);
    }

    getHomework(homework: any): any{
        this.vm.isChecking = true;
        this.vm.selectedHomework = homework;
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
                'mobileNumber': tempStudent.mobileNumber,
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
            currentStudentHomework.images.sort((a,b) => a.orderNumber < b.orderNumber ? -1 : a.orderNumber > b.orderNumber ? 1 : 0);
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
            if(studentHomework.status == this.vm.HOMEWORK_STATUS[2] && this.vm.sendCheckUpdate == true && this.vm.sendUpdateType!= 'NULL'){
                let tempData = {
                    'mobileNumber': studentHomework.mobileNumber,
                    'homeworkName': this.vm.selectedHomework.homeworkName,
                    'subject': this.vm.selectedSubject.name,
                }
                let mobile_list = [];
                mobile_list.push(tempData);
                this.sendSMSNotification(mobile_list, this.vm.checkUpdateMessage);
            }
            else if(studentHomework.status == this.vm.HOMEWORK_STATUS[3] && this.vm.sendResubmissionUpdate == true && this.vm.sendUpdateType!= 'NULL'){
                let tempData = {
                    'mobileNumber': studentHomework.mobileNumber,
                    'homeworkName': this.vm.selectedHomework.homeworkName,
                    'subject': this.vm.selectedSubject.name,
                }
                let mobile_list = [];
                mobile_list.push(tempData);
                this.sendSMSNotification(mobile_list, this.vm.resubmissionUpdateMessage);
            }
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

    sendSMSNotification: any = (mobile_list: any, message: any) => {
        let service_list = [];
        let notification_list = [];
        let sms_list = [];
        if (this.vm.sendUpdateType == 'SMS') {
            sms_list = mobile_list;
            notification_list = [];
        } else if (this.vm.sendUpdateType == 'NOTIFICATION') {       
            sms_list = [];
            notification_list = mobile_list.filter(obj => {
                return obj.notification;
            });
        } else {
            notification_list = mobile_list.filter(obj => {
                return obj.notification;
            });
            sms_list = mobile_list.filter(obj => {
                return !obj.notification;
            })
        }
        let notif_mobile_string = '';
        let sms_mobile_string = '';
        notification_list.forEach((item, index) => {
            notif_mobile_string += item.mobileNumber + ', ';
        });
        // notif_mobile_string = notif_mobile_string.slice(0, -2);
        sms_list.forEach((item, index) => {
            sms_mobile_string += item.mobileNumber + ', ';
        })
        sms_mobile_string = sms_mobile_string.slice(0, -2);
        notif_mobile_string = notif_mobile_string.slice(0, -2);
        if ((sms_list.length > 0) && (this.vm.getEstimatedSMSCount(message) > this.vm.smsBalance)) {
            alert('You are short by ' + (this.vm.getEstimatedSMSCount(message) - this.vm.smsBalance) + ' SMS');
        }
        let sms_data = {};
        const sms_converted_data = sms_list.map(item => {
            return {
                'mobileNumber': item.mobileNumber.toString(),
                'isAdvanceSms': this.vm.getMessageFromTemplate(message, item)
            }
        });
        if (sms_list.length != 0) {

            sms_data = {
                'contentType': ('english'),
                'data': sms_converted_data,
                'content': sms_converted_data[0]['isAdvanceSms'],
                'parentMessageType': 2,
                'count': this.vm.getEstimatedSMSCount(message),
                'notificationCount': notification_list.length,
                'notificationMobileNumberList': notif_mobile_string,
                'mobileNumberList': sms_mobile_string,
                'parentSchool': this.vm.user.activeSchool.dbId,
            };

        } else {
            sms_data = {
                'contentType': ('english'),
                'data': sms_converted_data,
                'content': this.vm.getMessageFromTemplate(message, notification_list[0]),
                'parentMessageType': 2,
                'count': this.vm.getEstimatedSMSCount(message),
                'notificationCount': notification_list.length,
                'notificationMobileNumberList': notif_mobile_string,
                'mobileNumberList': sms_mobile_string,
                'parentSchool': this.vm.user.activeSchool.dbId,
            };
        }

        const notification_data = notification_list.map(item => {
            return {
                'parentMessageType': 2,
                'content': this.vm.getMessageFromTemplate(message, item),
                'parentUser': this.vm.notif_usernames.find(user => { return user.username == item.mobileNumber.toString(); }).id,
                'parentSchool': this.vm.user.activeSchool.dbId,
            };
        });
        service_list = [];
        service_list.push(this.vm.smsService.createObject(this.vm.smsService.diff_sms, sms_data));
        if (notification_data.length > 0 ) {
            service_list.push(this.vm.notificationService.createObjectList(this.vm.notificationService.notification, notification_data));
        }

        console.log(sms_converted_data);
        console.log(notification_data);

        // this.vm.isLoading = true;

        // Promise.all(service_list).then(value => {

        //     if ((this.vm.sendUpdateType == 'SMS' ||
        //     this.vm.sendUpdateType == 'NOTIF./SMS') &&
        //         (sms_list.length > 0)) {
        //         if (value[0].status === 'success') {
        //             this.vm.smsBalance -= value[0].data.count;
        //         } else if (value[0].status === 'failure') {
        //             this.vm.smsBalance = value[0].count;
        //         }
        //     }

        //     this.vm.isLoading = false;
        // }, error => {
        //     this.vm.isLoading = false;
        // })
    }



}