import {Injectable} from '@angular/core';

/*
SentUpdateType - 
    1- NULL
    2- SMS
    3- NOTIFICATION
    4- NOTIF./SMS
*/

@Injectable()
export class UpdateService{

    STUDENT_LIMITER = 200;
    notif_usernames = [];
    sentTypeList = [
        'NULL',
        'SMS',
        'NOTIFICATION',
        'NOTIF./SMS',
    ];

    
    fetchGCMDevices: any = (studentList: any) => {

        let return_data = {};
        const service_list = [];
        const iterationCount = Math.ceil(studentList.length / this.STUDENT_LIMITER);
        let loopVariable = 0;

        while (loopVariable < iterationCount) {
            const mobile_list = studentList.filter(item => item.mobileNumber).map(obj => obj.mobileNumber.toString());
            const gcm_data = {
                'user__username__in': mobile_list.slice(
                    this.STUDENT_LIMITER * loopVariable, this.STUDENT_LIMITER * (loopVariable + 1)
                ),
                'active': 'true__boolean',
            }
            const user_data = {
                'fields__korangle': 'username,id',
                'username__in': mobile_list.slice(this.STUDENT_LIMITER * loopVariable, this.STUDENT_LIMITER * (loopVariable + 1)),
            };
            return_data['gcm_data'] = gcm_data;
            return_data['user_data'] = user_data;
            loopVariable = loopVariable + 1;
        }
        return return_data;

        
    }

    populateNotificationTrueValue(value: any, student_list: any){
        let temp_gcm_list = [];
            let temp_user_list = [];
            let loopVariable = 0;
            const iterationCount = Math.ceil(student_list.length / this.STUDENT_LIMITER);

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
            this.notif_usernames = notif_usernames;

            let notification_list;

            notification_list = student_list.filter(obj => {
                return notif_usernames.find(user => {
                    return user.username == obj.mobileNumber;
                }) != undefined;
            });
            student_list.forEach((item, i) => {
                item.notification = false;
            })
            notification_list.forEach((item, i) => {
                item.notification = true;
            })
        
    }

    sendSMSNotification: any = (student_list: any, message: any, informationMessageType: any, sentUpdateType: any, schoolId: any, smsBalance: any) => {
        let notification_list = [];
        let sms_list = [];
        student_list = student_list.filter(student =>{
            if(this.checkMobileNumber(student.mobileNumber) == true) return true;
            return false;
        })
        if (sentUpdateType == 2) {
            sms_list = student_list;
            notification_list = [];
        } else if (sentUpdateType == 3) {       
            sms_list = [];
            notification_list = student_list.filter(obj => {
                return obj.notification;
            });
        } else {
            notification_list = student_list.filter(obj => {
                return obj.notification;
            });
            sms_list = student_list.filter(obj => {
                return !obj.notification;
            })
        }
        let notif_mobile_string = '';
        let sms_mobile_string = '';
        notification_list.forEach((item, index) => {
            notif_mobile_string += item.mobileNumber + ', ';
        });
        sms_list.forEach((item, index) => {
            sms_mobile_string += item.mobileNumber + ', ';
        })
        sms_mobile_string = sms_mobile_string.slice(0, -2);
        notif_mobile_string = notif_mobile_string.slice(0, -2);
        if ((sms_list.length > 0) && (this.getEstimatedSMSCount(sentUpdateType, student_list, message) > smsBalance)) {
            alert('You are short by ' + (this.getEstimatedSMSCount(sentUpdateType, student_list, message) - smsBalance) + ' SMS');
        }
        let sms_data = {};
        const sms_converted_data = sms_list.map(item => {
            return {
                'mobileNumber': item.mobileNumber.toString(),
                'isAdvanceSms': this.getMessageFromTemplate(message, item)
            }
        
        });
        if (sms_list.length != 0) {

            sms_data = {
                'contentType': ('english'),
                'data': sms_converted_data,
                'content': sms_converted_data[0]['isAdvanceSms'],
                'parentMessageType': informationMessageType,
                'count': this.getEstimatedSMSCount(sentUpdateType, student_list, message),
                'notificationCount': notification_list.length,
                'notificationMobileNumberList': notif_mobile_string,
                'mobileNumberList': sms_mobile_string,
                'parentSchool': schoolId,
            };

        } else {
            sms_data = {
                'contentType': ('english'),
                'data': sms_converted_data,
                'content': this.getMessageFromTemplate(message, notification_list[0]),
                'parentMessageType': informationMessageType,
                'count': this.getEstimatedSMSCount(sentUpdateType, student_list, message),
                'notificationCount': notification_list.length,
                'notificationMobileNumberList': notif_mobile_string,
                'mobileNumberList': sms_mobile_string,
                'parentSchool': schoolId,
            };
        }

        const notification_data = notification_list.map(item => {
            return {
                'parentMessageType': informationMessageType,
                'content': this.getMessageFromTemplate(message, item),
                'parentUser': this.notif_usernames.find(user => { return user.username == item.mobileNumber.toString(); }).id,
                'parentSchool': schoolId,
            };
        
        });

        let return_data = {};
        return_data['sms_list_length'] = sms_list.length;
        return_data['sms_data'] = sms_data;
        return_data['notification_data'] = notification_data;
        return return_data;
        
    }

    checkMobileNumber(mobileNumber: number): boolean {
        if (mobileNumber && mobileNumber.toString().length == 10) {
            return true;
        }
        return false;
    }

    getMessageFromTemplate = (message, obj) => {
        let ret = message;
        for(let key in obj){
            ret = ret.replace('<'+key+'>', obj[key]);
        }
        return ret;
    }

    hasUnicode(message): boolean {
        for (let i=0; i<message.length; ++i) {
            if (message.charCodeAt(i) > 127) {
                return true;
            }
        }
        return false;
    }

    getEstimatedSMSCount = (sentUpdateType: any, student_list: any, message: any) => {
        let count = 0;
        if(sentUpdateType==3)return 0;
            student_list.filter(item => item.mobileNumber).forEach((item, i) => {
                if(sentUpdateType==1 || item.notification==false){
                    count += this.getMessageCount(this.getMessageFromTemplate(message, item));
                }
            })

        return count;
    }

    getMessageCount = (message) => {
        if (this.hasUnicode(message)){
            return Math.ceil(message.length/70);
        }else{
            return Math.ceil( message.length/160);
        }
    }

}