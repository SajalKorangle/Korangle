import { RecordAttendanceComponent } from './record-attendance.component';

export class RecordAttendanceServiceAdapter {

    vm: RecordAttendanceComponent;

    constructor() {}

    // Data

    initializeAdapter(vm: RecordAttendanceComponent): void {
        this.vm = vm;
    }

    initializeData(): void {
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
        // console.log(studentList);
        
        this.sendSMSNotification(this.vm.studentList, this.vm.studentUpdateMessage);
    }

    sendSMSNotification: any = (mobile_list: any, message: string) => {
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
        
        if (sms_list.length > 0) {
            if (!confirm('Please confirm that you are sending ' + (this.vm.getEstimatedSMSCount()) + ' SMS.')) {
                return;
            }
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
                'content': this.vm.getMessageFromTemplate(message, notification_list[0]),
                'parentMessageType': 2,
                'count': this.vm.getEstimatedSMSCount(),
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
        console.log(sms_data);
        service_list = [];
        service_list.push(this.vm.smsService.createObject(this.vm.smsService.diff_sms, sms_data));
        if (notification_data.length > 0 ) {
            service_list.push(this.vm.notificationService.createObjectList(this.vm.notificationService.notification, notification_data));
        }

        this.vm.isLoading = true;

        Promise.all(service_list).then(value => {

            alert('Operation Successful');

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
