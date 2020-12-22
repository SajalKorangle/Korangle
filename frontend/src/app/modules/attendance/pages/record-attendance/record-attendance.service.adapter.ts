import { RecordAttendanceComponent } from './record-attendance.component';

export class RecordAttendanceServiceAdapter {

    vm: RecordAttendanceComponent;

    infornmationMessageType = 4; //Attendance Message

    constructor() {}
    // Data

    initializeAdapter(vm: RecordAttendanceComponent): void {
        this.vm = vm;
    }

    initializeData(): void {

        this.vm.isInitialLoading = true;
        const sms_count_request_data = {
            parentSchool: this.vm.user.activeSchool.dbId,
        };

        let request_attendance_permission_list_data = {
            parentEmployee: this.vm.user.activeSchool.employeeId,
            parentSession: this.vm.user.activeSchool.currentSessionDbId,
        };

        let student_section_data = {
            'parentStudent__parentSchool': this.vm.user.activeSchool.dbId,
            'parentSession': this.vm.user.activeSchool.currentSessionDbId,
        };

        let student_data = {
            'parentSchool': this.vm.user.activeSchool.dbId,
            'fields__korangle': 'id,name,mobileNumber,scholarNumber,parentTransferCertificate'
        };

        Promise.all([
            this.vm.attendanceService.getObjectList(this.vm.attendanceService.attendance_settings, {'parentSchool': this.vm.user.activeSchool.dbId}),
            this.vm.attendanceService.getObjectList(this.vm.attendanceService.attendance_permission, request_attendance_permission_list_data),
            this.vm.studentService.getObjectList(this.vm.studentService.student_section, student_section_data),
            this.vm.classService.getObjectList(this.vm.classService.classs, {}),
            this.vm.classService.getObjectList(this.vm.classService.division, {}),
            this.vm.studentService.getObjectList(this.vm.studentService.student, student_data),
            this.vm.smsOldService.getSMSCount(sms_count_request_data, this.vm.user.jwt),
        ]).then(value => {
            this.initializeClassSectionStudentList(value[3], value[4], value[2], value[5], value[1]);
            this.vm.smsBalance = value[6];
            if(value[0].length > 0){
                this.vm.selectedSentType = value[0][0].sentUpdateType;
                this.vm.selectedSentUpdateTo = value[0][0].sentUpdateToType;
            }
            else{
                this.vm.selectedSentType = 'NULL';
                this.vm.selectedSentUpdateTo = 'Only Absent Students';
            }
            this.vm.isInitialLoading = false;
        }, error => {
            this.vm.isInitialLoading = false;
        });
    }

    initializeClassSectionStudentList(classList: any, divisionList: any, studentList: any, studentDetailsList: any, attendancePermissionList:any):any{
        this.vm.classSectionStudentList = [];
        studentList.forEach(student =>{
            if (this.vm.classSectionInPermissionList(student.parentClass, student.parentDivision, attendancePermissionList)){
                let classIndex = -1;
                let tempIndex = 0;
                this.vm.classSectionStudentList.forEach(classs =>{
                    if(classs.dbId == student.parentClass){
                        classIndex = tempIndex;
                        return ;
                    }
                    tempIndex = tempIndex+1;
                });
                if(classIndex === -1){
                    let classs = classList.find(classs => classs.id === student.parentClass);
                    let tempClass = {
                        name: classs.name,
                        dbId: classs.id,
                        sectionList: [],
                    }
                    this.vm.classSectionStudentList.push(tempClass);
                    let tempIndex = 0;
                    this.vm.classSectionStudentList.forEach(classs =>{
                        if(classs.dbId == student.parentClass){
                            classIndex = tempIndex;
                            return ;
                    }
                    tempIndex = tempIndex+1;
                    });
                }
                let divisionIndex = -1;
                tempIndex = 0;
                this.vm.classSectionStudentList[classIndex].sectionList.forEach(division =>{
                    if(division.dbId == student.parentDivision){
                        divisionIndex = tempIndex;
                        return ;
                    }
                    tempIndex = tempIndex+1;
                });
                
                if(divisionIndex === -1){
                    let division = divisionList.find(division => division.id === student.parentDivision);
                    let tempDivision = {
                        name: division.name,
                        dbId: division.id,
                        studentList: [],
                    }
                    this.vm.classSectionStudentList[classIndex].sectionList.push(tempDivision);
                    tempIndex = 0;
                    this.vm.classSectionStudentList[classIndex].sectionList.forEach(division =>{
                        if(division.dbId == student.parentDivision){
                            divisionIndex = tempIndex;
                            return ;
                        }
                        tempIndex = tempIndex+1;
                    });
                }
                let studentDetails = studentDetailsList.find(studentDetails => studentDetails.id == student.parentStudent);
                let tempData = {
                    name: studentDetails.name,
                    dbId: studentDetails.id,
                    scholarNumber: studentDetails.scholarNumber,
                    mobileNumber: studentDetails.mobileNumber,
                }
                this.vm.classSectionStudentList[classIndex].sectionList[divisionIndex].studentList.push(tempData);
            }
        });
        this.vm.classSectionStudentList.forEach(classs =>{
            classs.sectionList.forEach( section => {
                section.studentList.sort((a, b) => a.name < b.name ? -1 : a.name > b.name ? 1 : 0);
            });
            classs.sectionList.sort(((a, b) => a.dbId < b.dbId ? -1 : a.dbId > b.dbId ? 1 : 0))
        })
        this.vm.classSectionStudentList.sort(((a, b) => a.dbId < b.dbId ? -1 : a.dbId > b.dbId ? 1 : 0))
        if (this.vm.classSectionStudentList.length > 0) {
            this.vm.selectedClass = this.vm.classSectionStudentList[0];
            this.vm.changeSelectedSectionToFirst();
        }
        
    }

    fetchGCMDevices: any = (studentList: any) => {
        // console.log(studentList);
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

    sendSMSNotification: any = (mobile_list: any) => {
        let service_list = [];
        let notification_list = [];
        let sms_list = [];
        if (this.vm.selectedSentType == this.vm.sentTypeList[0]) {
            sms_list = mobile_list;
            notification_list = [];
        } else if (this.vm.selectedSentType == this.vm.sentTypeList[1]) {       
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
        if ((sms_list.length > 0) && (this.vm.getEstimatedSMSCount() > this.vm.smsBalance)) {
            alert('You are short by ' + (this.vm.getEstimatedSMSCount() - this.vm.smsBalance) + ' SMS');
        }
        let sms_data = {};
        const sms_converted_data = sms_list.map(item => {
            if(item.messageType === 1){
                return {
                    'mobileNumber': item.mobileNumber.toString(),
                    'isAdvanceSms': this.vm.getMessageFromTemplate(this.vm.studentUpdateMessage, item)
                }
            }
            else{
                return {
                    'mobileNumber': item.mobileNumber.toString(),
                    'isAdvanceSms': this.vm.getMessageFromTemplate(this.vm.studentAlternateMessage, item)
                }
            }
        });
        if (sms_list.length != 0) {

            sms_data = {
                'contentType': ('english'),
                'data': sms_converted_data,
                'content': sms_converted_data[0]['isAdvanceSms'],
                'parentMessageType': this.infornmationMessageType,
                'count': this.vm.getEstimatedSMSCount(),
                'notificationCount': notification_list.length,
                'notificationMobileNumberList': notif_mobile_string,
                'mobileNumberList': sms_mobile_string,
                'parentSchool': this.vm.user.activeSchool.dbId,
            };

        } else {
            sms_data = {
                'contentType': ('english'),
                'data': sms_converted_data,
                'content': this.vm.getMessageFromTemplate(this.vm.studentUpdateMessage, notification_list[0]),
                'parentMessageType': this.infornmationMessageType,
                'count': this.vm.getEstimatedSMSCount(),
                'notificationCount': notification_list.length,
                'notificationMobileNumberList': notif_mobile_string,
                'mobileNumberList': sms_mobile_string,
                'parentSchool': this.vm.user.activeSchool.dbId,
            };
            if(notification_list[0].messageType === 2){
                sms_data['content'] = this.vm.getMessageFromTemplate(this.vm.studentAlternateMessage, notification_list[0]);
            }
        }

        const notification_data = notification_list.map(item => {
            if(item.messageType === 1){
                return {
                    'parentMessageType': this.infornmationMessageType,
                    'content': this.vm.getMessageFromTemplate(this.vm.studentUpdateMessage, item),
                    'parentUser': this.vm.notif_usernames.find(user => { return user.username == item.mobileNumber.toString(); }).id,
                    'parentSchool': this.vm.user.activeSchool.dbId,
                };
            }
            else{
                return {
                    'parentMessageType': this.infornmationMessageType,
                    'content': this.vm.getMessageFromTemplate(this.vm.studentAlternateMessage, item),
                    'parentUser': this.vm.notif_usernames.find(user => { return user.username == item.mobileNumber.toString(); }).id,
                    'parentSchool': this.vm.user.activeSchool.dbId,
                };
            }
        });
        service_list = [];
        service_list.push(this.vm.smsService.createObject(this.vm.smsService.diff_sms, sms_data));
        if (notification_data.length > 0 ) {
            service_list.push(this.vm.notificationService.createObjectList(this.vm.notificationService.notification, notification_data));
        }

        this.vm.isLoading = true;

        Promise.all(service_list).then(value => {

            if ((this.vm.selectedSentType === this.vm.sentTypeList[0] ||
                this.vm.selectedSentType === this.vm.sentTypeList[2]) &&
                (sms_list.length > 0)) {
                if (value[0].status === 'success') {
                    this.vm.smsBalance -= value[0].data.count;
                } else if (value[0].status === 'failure') {
                    this.vm.smsBalance = value[0].count;
                }
            }

            this.vm.isLoading = false;
        }, error => {
            this.vm.isLoading = false;
        })
    }
}
