import {Injectable} from '@angular/core';
import { NotificationService } from '../services/modules/notification/notification.service'
import { UserService } from '../services/modules/user/user.service';
import { SmsService } from '../services/modules/sms/sms.service'


@Injectable()
export class UpdateService{

    // constructor(
    //     public notificationService: NotificationService,
    //     public userService: UserService,
    //     public smsService: SmsService,
    // ){ }

    // public notificationService: NotificationService;
    // public userService: UserService;
    // public smsService: SmsService; 

    // initializeUpdateService(): any{
    //     this.notificationService = new NotificationService;
    //     this.userService =  new UserService;
    //     this.smsService = new SmsService;
    // }

    STUDENT_LIMITER = 200;
    notif_usernames = [];
    smsBalance: any;
    informationMessageType: any;
    message: any;
    schoolId: any;

    setSchoolId(id: any): any{
        this.schoolId = id;
    }
    setStudentList(student_list:any): any{
        this.student_list = student_list;
        console.log(this.student_list);
    }
    setSmsBalance(smsBalance:any): any{
        this.smsBalance = smsBalance;
    }
    setInfornamtionType(informationMessageType:any): any{
        this.informationMessageType = informationMessageType;
    }
    setMessage(message:any): any{
        this.message = message;
    }

    sentTypeList = [
        'NULL',
        'SMS',
        'NOTIFICATION',
        'NOTIF./SMS',
    ];

    student_list : any;
    sentUpdateType: any;

    // fetchGCMDevices: any = () => {
    //     // console.log(studentList);
    //     const service_list = [];
    //     const iterationCount = Math.ceil(this.student_list.length / this.STUDENT_LIMITER);
    //     let loopVariable = 0;

    //     while (loopVariable < iterationCount) {
    //         const mobile_list = this.student_list.filter(item => item.mobileNumber).map(obj => obj.mobileNumber.toString());
    //         const gcm_data = {
    //             'user__username__in': mobile_list.slice(
    //                 this.STUDENT_LIMITER * loopVariable, this.STUDENT_LIMITER * (loopVariable + 1)
    //             ),
    //             'active': 'true__boolean',
    //         }
    //         // console.log(gcm_data);
    //         const user_data = {
    //             'fields__korangle': 'username,id',
    //             'username__in': mobile_list.slice(this.STUDENT_LIMITER * loopVariable, this.STUDENT_LIMITER * (loopVariable + 1)),
    //         };
    //         // console.log(user_data);
    //         service_list.push(this.notificationService.getObjectList(this.notificationService.gcm_device, gcm_data));
    //         service_list.push(this.userService.getObjectList(this.userService.user, user_data));
    //         // console.log(service_list);
    //         loopVariable = loopVariable + 1;
    //     }

    //     Promise.all(service_list).then((value) => {
    //         let temp_gcm_list = [];
    //         let temp_user_list = [];
    //         let loopVariable = 0;
    //         while (loopVariable < iterationCount) {
    //             temp_gcm_list = temp_gcm_list.concat(value[loopVariable * 2]);
    //             temp_user_list = temp_user_list.concat(value[loopVariable * 2 + 1]);
    //             loopVariable = loopVariable + 1;
    //         }

    //         const notif_usernames = temp_user_list.filter(user => {
    //             return temp_gcm_list.find(item => {
    //                 return item.user == user.id;
    //             }) != undefined;
    //         })
    //         // Storing because they're used later
    //         this.notif_usernames = notif_usernames;

    //         let notification_list;

    //         notification_list = this.student_list.filter(obj => {
    //             return notif_usernames.find(user => {
    //                 return user.username == obj.mobileNumber;
    //             }) != undefined;
    //         });
    //         this.student_list.forEach((item, i) => {
    //             item.notification = false;
    //         })
    //         notification_list.forEach((item, i) => {
    //             item.notification = true;
    //         })


    //         // this.isLoading = false;
    //     })

    // }

    // sendSMSNotification: any = () => {
    //     let service_list = [];
    //     let notification_list = [];
    //     let sms_list = [];
    //     if (this.sentUpdateType == this.sentTypeList[0]) {
    //         sms_list = this.student_list;
    //         notification_list = [];
    //     } else if (this.sentUpdateType == this.sentTypeList[1]) {       
    //         sms_list = [];
    //         notification_list = this.student_list.filter(obj => {
    //             return obj.notification;
    //         });
    //     } else {
    //         notification_list = this.student_list.filter(obj => {
    //             return obj.notification;
    //         });
    //         sms_list = this.student_list.filter(obj => {
    //             return !obj.notification;
    //         })
    //     }
    //     let notif_mobile_string = '';
    //     let sms_mobile_string = '';
    //     notification_list.forEach((item, index) => {
    //         notif_mobile_string += item.mobileNumber + ', ';
    //     });
    //     sms_list.forEach((item, index) => {
    //         sms_mobile_string += item.mobileNumber + ', ';
    //     })
    //     sms_mobile_string = sms_mobile_string.slice(0, -2);
    //     notif_mobile_string = notif_mobile_string.slice(0, -2);
    //     if ((sms_list.length > 0) && (this.getEstimatedSMSCount() > this.smsBalance)) {
    //         alert('You are short by ' + (this.getEstimatedSMSCount() - this.smsBalance) + ' SMS');
    //     }
    //     let sms_data = {};
    //     const sms_converted_data = sms_list.map(item => {
    //         return {
    //             'mobileNumber': item.mobileNumber.toString(),
    //             'isAdvanceSms': this.getMessageFromTemplate(this.message, item)
    //         }
        
    //     });
    //     if (sms_list.length != 0) {

    //         sms_data = {
    //             'contentType': ('english'),
    //             'data': sms_converted_data,
    //             'content': sms_converted_data[0]['isAdvanceSms'],
    //             'parentMessageType': this.informationMessageType,
    //             'count': this.getEstimatedSMSCount(),
    //             'notificationCount': notification_list.length,
    //             'notificationMobileNumberList': notif_mobile_string,
    //             'mobileNumberList': sms_mobile_string,
    //             'parentSchool': this.schoolId,
    //         };

    //     } else {
    //         sms_data = {
    //             'contentType': ('english'),
    //             'data': sms_converted_data,
    //             'content': this.getMessageFromTemplate(this.message, notification_list[0]),
    //             'parentMessageType': this.informationMessageType,
    //             'count': this.getEstimatedSMSCount(),
    //             'notificationCount': notification_list.length,
    //             'notificationMobileNumberList': notif_mobile_string,
    //             'mobileNumberList': sms_mobile_string,
    //             'parentSchool': this.schoolId,
    //         };
    //     }

    //     const notification_data = notification_list.map(item => {
    //         return {
    //             'parentMessageType': this.informationMessageType,
    //             'content': this.getMessageFromTemplate(this.message, item),
    //             'parentUser': this.notif_usernames.find(user => { return user.username == item.mobileNumber.toString(); }).id,
    //             'parentSchool': this.schoolId,
    //         };
        
    //     });
    //     service_list = [];
    //     service_list.push(this.smsService.createObject(this.smsService.diff_sms, sms_data));
    //     if (notification_data.length > 0 ) {
    //         service_list.push(this.notificationService.createObjectList(this.notificationService.notification, notification_data));
    //     }

    //     Promise.all(service_list).then(value => {

    //         if ((this.sentUpdateType === this.sentTypeList[0] ||
    //             this.sentUpdateType === this.sentTypeList[2]) &&
    //             (sms_list.length > 0)) {
    //             if (value[0].status === 'success') {
    //                 this.smsBalance -= value[0].data.count;
    //             } else if (value[0].status === 'failure') {
    //                 this.smsBalance = value[0].count;
    //             }
    //         }
    //     }, error => {
    //     })
    // }

    // checkMobileNumber(mobileNumber: number): boolean {
    //     if (mobileNumber && mobileNumber.toString().length == 10) {
    //         return true;
    //     }
    //     return false;
    // }

    // getMessageFromTemplate = (message, obj) => {
    //     let ret = message;
    //     for(let key in obj){
    //         ret = ret.replace('<'+key+'>', obj[key]);
    //     }
    //     return ret;
    // }

    // hasUnicode(message): boolean {
    //     for (let i=0; i<message.length; ++i) {
    //         if (message.charCodeAt(i) > 127) {
    //             return true;
    //         }
    //     }
    //     return false;
    // }

    // getEstimatedSMSCount = () => {
    //     let count = 0;
    //     if(this.sentUpdateType==this.sentTypeList[1])return 0;
    //         this.student_list.filter(item => item.mobileNumber).forEach((item, i) => {
    //             if(this.sentUpdateType==this.sentTypeList[0] || item.notification==false){
    //                 count += this.getMessageCount(this.getMessageFromTemplate(this.message, item));
    //             }
    //         })

    //     return count;
    // }

    // getMessageCount = (message) => {
    //     if (this.hasUnicode(message)){
    //         return Math.ceil(message.length/70);
    //     }else{
    //         return Math.ceil( message.length/160);
    //     }
    // }

    // getEstimatedNotificationCount = () => {
    //     let count = 0;
    //     if(this.sentUpdateType==this.sentTypeList[0])return 0;

    //     count = this.student_list.filter((item) => {
    //         return item.mobileNumber && item.notification;
    //     }).length;

    //     return count;
    // }

}