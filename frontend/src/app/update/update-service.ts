import {UserService} from '../services/modules/user/user.service';
import {NotificationService} from '../services/modules/notification/notification.service';
import {SmsService} from '../services/modules/sms/sms.service';
import {EVENT_SETTING_PAGES} from '@modules/sms/classes/constants';

/*
SentUpdateType -
    1- NULL
    2- SMS
    3- NOTIFICATION
    4- NOTIF./SMS
*/

/*@Component({
    providers: [
        NotificationService,
        UserService,
        SmsService,
    ],
})*/

export class UpdateService {
    STUDENT_LIMITER = 200;
    notif_usernames = [];
    sentTypeList = ['NULL', 'SMS', 'NOTIFICATION', 'NOTIF./SMS'];

    notificationService: any;
    userService: any;
    smsService: any;

    constructor(notificationService: NotificationService, userService: UserService, smsService: SmsService) {
        this.notificationService = notificationService;
        this.userService = userService;
        this.smsService = smsService;
    }

    fetchGCMDevicesNew: any = (studentList: any) => {
        const service_list = [];
        const iterationCount = Math.ceil(studentList.length / this.STUDENT_LIMITER);
        let loopVariable = 0;

        while (loopVariable < iterationCount) {
            const mobile_list = studentList.filter((item) => item.mobileNumber).map((obj) => obj.mobileNumber.toString());
            const gcm_data = {
                user__username__in: mobile_list.slice(this.STUDENT_LIMITER * loopVariable, this.STUDENT_LIMITER * (loopVariable + 1)),
                active: 'true__boolean',
            };
            const user_data = {
                fields__korangle: 'username,id',
                username__in: mobile_list.slice(this.STUDENT_LIMITER * loopVariable, this.STUDENT_LIMITER * (loopVariable + 1)),
            };
            service_list.push(this.notificationService.getObjectList(this.notificationService.gcm_device, gcm_data));
            service_list.push(this.userService.getObjectList(this.userService.user, user_data));
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

            const notif_usernames = temp_user_list.filter((user) => {
                return (
                    temp_gcm_list.find((item) => {
                        return item.user == user.id;
                    }) != undefined
                );
            });
            // Storing because they're used later
            this.notif_usernames = notif_usernames;

            let notification_list;

            notification_list = studentList.filter((obj) => {
                return (
                    notif_usernames.find((user) => {
                        return user.username == obj.mobileNumber;
                    }) != undefined
                );
            });
            studentList.forEach((item, i) => {
                item.notification = false;
            });
            notification_list.forEach((item, i) => {
                item.notification = true;
            });
        });
    }

    sendSMSNotificationNew: any = (
        mobile_list: any,
        message: any,
        informationMessageType: any,
        sentUpdateType: any,
        schoolId: any,
        smsBalance: any
    ) => {
        let service_list = [];
        let notification_list = [];
        let sms_list = [];

        if (sentUpdateType == 2) {
            sms_list = mobile_list;
            notification_list = [];
        } else if (sentUpdateType == 3) {
            sms_list = [];
            notification_list = mobile_list.filter((obj) => {
                return obj.notification;
            });
        } else {
            notification_list = mobile_list.filter((obj) => {
                return obj.notification;
            });
            sms_list = mobile_list.filter((obj) => {
                return !obj.notification;
            });
        }
        let notif_mobile_string = '';
        let sms_mobile_string = '';
        notification_list.forEach((item, index) => {
            notif_mobile_string += item.mobileNumber + ', ';
        });

        sms_list.forEach((item, index) => {
            sms_mobile_string += item.mobileNumber + ', ';
        });
        sms_mobile_string = sms_mobile_string.slice(0, -2);
        notif_mobile_string = notif_mobile_string.slice(0, -2);

        let sms_data = {};
        const sms_converted_data = sms_list.map((item) => {
            return {
                mobileNumber: item.mobileNumber.toString(),
                isAdvanceSms: this.getMessageFromTemplate(message, item),
            };
        });
        if (sms_list.length != 0) {
            sms_data = {
                contentType: 'english',
                data: sms_converted_data,
                content: sms_converted_data[0]['isAdvanceSms'],
                parentMessageType: informationMessageType,
                count: this.getEstimatedSMSCount(sentUpdateType, mobile_list, message),
                notificationCount: this.getEstimatedNotificationCount(sentUpdateType, mobile_list),
                notificationMobileNumberList: notif_mobile_string,
                mobileNumberList: sms_mobile_string,
                parentSchool: schoolId,
            };
        } else {
            sms_data = {
                contentType: 'english',
                data: sms_converted_data,
                content: this.getMessageFromTemplate(message, notification_list[0]),
                parentMessageType: informationMessageType,
                count: this.getEstimatedSMSCount(sentUpdateType, mobile_list, message),
                notificationCount: this.getEstimatedNotificationCount(sentUpdateType, mobile_list),
                notificationMobileNumberList: notif_mobile_string,
                mobileNumberList: sms_mobile_string,
                parentSchool: schoolId,
            };
        }

        const notification_data = notification_list.map((item) => {
            return {
                parentMessageType: informationMessageType,
                content: this.getMessageFromTemplate(message, item),
                parentUser: this.notif_usernames.find((user) => {
                    return user.username == item.mobileNumber.toString();
                }).id,
                parentSchool: schoolId,
            };
        });
        service_list = [];
        service_list.push(this.smsService.createObject(this.smsService.diff_sms, sms_data));
        if (notification_data.length > 0) {
            service_list.push(this.notificationService.createObjectList(this.notificationService.notification, notification_data));
        }

        Promise.all(service_list).then((value) => {
            if ((sentUpdateType == 2 || sentUpdateType == 4) && sms_list.length > 0) {
                if (value[0].status === 'success') {
                    smsBalance -= value[0].data.count;
                } else if (value[0].status === 'failure') {
                    smsBalance = value[0].count;
                }
            }
        });
    }

    async sendEventNotification(
        Data,
        eventName,
        schoolId,
        smsBalance,
    ) {
        const smsEvent = await this.smsService.getObject(this.smsService.sms_event, {eventName: eventName});
        if (!smsEvent) {
            return;
        } // if there is not event return

        let fetch_event_settings_list = {
            parentSMSEvent: smsEvent.id,
            parentSchool: schoolId,
        };

        const eventSettings = await this.smsService.getObject(this.smsService.sms_event_settings, fetch_event_settings_list);
        if (!eventSettings || eventSettings.parentSentUpdateType == 1) {
            return;
        } // if there is not event settings or sentUpdateType is null then return

        let customSMSTemplate, smsId = 1, smsRawContent = smsEvent.defaultSMSContent, notificationRawContent;

        if (eventSettings.parentSMSTemplate && eventSettings.parentSMSTemplate != 0) {
            customSMSTemplate = await this.smsService.getObject(this.smsService.sms_template,
                {id: eventSettings.parentSMSTemplate});
            smsRawContent = customSMSTemplate.rawContent;
            smsId = customSMSTemplate.parentSMSId;
        }

        notificationRawContent = eventSettings.customNotificationContent ? eventSettings.customNotificationContent : smsEvent.defaultNotificationContent;

        await this.smsNotificationSender(
            Data,
            smsEvent,
            eventSettings.parentSentUpdateType,
            smsRawContent,
            notificationRawContent,
            smsId,
            schoolId,
            smsBalance
        );
    }

    async smsNotificationSender(
        data: any,
        smsEvent: any,
        sentUpdateType: any,
        smsRawContent: any,
        notificationRawContent: any,
        smsId: any,
        schoolId: any,
        smsBalance: any
    ) {
        let service_list = [];
        let notification_list = [];
        let sms_list = [];
        let personDetailsList = [];
        let eventVariableList = EVENT_SETTING_PAGES.find(settingPage => smsEvent.eventName.includes(settingPage.name));

        let person = data.studentList ? 'student' : 'employee';

        data[person + 'List'].forEach(personData => {
            personDetailsList.push(this.getMappingData(eventVariableList, data, person, personData.id));
        });

        if (sentUpdateType == 2) {
            sms_list = personDetailsList;
            notification_list = [];
        } else if (sentUpdateType == 3) {
            sms_list = [];
            notification_list = personDetailsList.filter((obj) => {
                return obj.notification;
            });
        } else {
            notification_list = personDetailsList.filter((obj) => {
                return obj.notification;
            });
            sms_list = personDetailsList.filter((obj) => {
                return !obj.notification;
            });
        }

        let notif_mobile_string = '';
        let sms_mobile_string = '';
        let smsMappedData = [];
        let notificationMappedData = [];

        notification_list.forEach((item, index) => {
            let temp = {
                mobileNumber: item.mobileNumber,
                content: this.getMessageFromTemplate(notificationRawContent, item)
            };
            if (!this.checkForDuplicate(eventVariableList, notificationMappedData, data, item.id, notificationRawContent)) {
                notif_mobile_string += item.mobileNumber + ', ';
                notificationMappedData.push(temp);
            }
        });

        sms_list.forEach((item, index) => {
            let temp = {
                mobileNumber: item.mobileNumber,
                isAdvanceSms: this.getMessageFromTemplate(smsRawContent, item)
            };
            if (this.checkForDuplicate(eventVariableList, smsMappedData, data, item.id, smsRawContent)) {
                sms_mobile_string += item.mobileNumber + ', ';
                smsMappedData.push(temp);
            }
        });

        sms_mobile_string = sms_mobile_string.slice(0, -2);
        notif_mobile_string = notif_mobile_string.slice(0, -2);

        let sms_data = {
            contentType: this.hasUnicode(smsRawContent) ? 'unicode' : 'english',
            parentSMSEvent: smsEvent.id,
            content: smsRawContent,
            parentMessageType: null,
            mobileNumberContentJson: JSON.stringify(smsMappedData),
            count: this.getEstimatedSMSCount(sentUpdateType, personDetailsList, smsRawContent),
            notificationCount: notificationMappedData.length,
            notificationMobileNumberList: notif_mobile_string,
            mobileNumberList: sms_mobile_string,
            parentSchool: schoolId,
            smsId: smsId,
        };

        console.log(sms_data);

        const notification_data = notification_list.map((item) => {
            return {
                parentMessageType: null,
                parentSMSEvent: smsEvent.id,
                content: notificationMappedData.find(items => items.mobileNumber == item.mobileNumber).content,
                parentUser: this.notif_usernames.find((user) => {
                    return user.username == item.mobileNumber.toString();
                }).id,
                parentSchool: schoolId,
            };
        });

        service_list = [];
        service_list.push(this.smsService.createObject(this.smsService.sms, sms_data));
        if (notification_data.length > 0) {
            service_list.push(this.notificationService.createObjectList(this.notificationService.notification, notification_data));
        }

        const value = await Promise.all(service_list);
        if ((sentUpdateType == 2 || sentUpdateType == 4) && sms_list.length > 0) {
            if (value[0].status === 'success') {
                smsBalance -= value[0].data.count;
            } else if (value[0].status === 'failure') {
                smsBalance = value[0].count;
            }
        }
    }

    getMessageFromTemplate = (message, obj) => {
        let ret = message;
        for (let key in obj) {
            ret = ret.replace(new RegExp('@' + key, 'g'), obj[key]);
        }
        ret.replace(/@/g, '');
        return ret;
    }

    hasUnicode(message): boolean {
        for (let i = 0; i < message.length; ++i) {
            if (message.charCodeAt(i) > 127) {
                return true;
            }
        }
        return false;
    }

    getEstimatedSMSCount = (sentUpdateType: any, student_list: any, message: any) => {
        let count = 0;
        if (sentUpdateType == 3) {
            return 0;
        }
        student_list
            .filter((item) => item.mobileNumber)
            .forEach((item, i) => {
                if (sentUpdateType == 2 || item.notification == false) {
                    count += this.getMessageCount(this.getMessageFromTemplate(message, item));
                }
            });

        return count;
    }

    getEstimatedNotificationCount = (sentUpdateType: any, student_list: any) => {
        let count = 0;
        if (sentUpdateType == 2) {
            return 0;
        }

        count = student_list.filter((item) => {
            return item.mobileNumber && item.notification;
        }).length;

        return count;
    }

    getMessageCount = (message) => {
        if (this.hasUnicode(message)) {
            return Math.ceil(message.length / 70);
        } else {
            return Math.ceil(message.length / 160);
        }
    }

    getMappingData(eventVariableList: any, data: any, person: any, personId: any) {
        let temp = {};
        data[person + 'Id'] = personId;
        eventVariableList.forEach(eventVariable => {
            temp[eventVariable.displayVariable] = eventVariable.getValueFunc(data);
        });
        return temp;
    }

    checkForDuplicate(eventVariables: any, previousList: any, data: any, personId: any, message: any, secondNumber: boolean = false): boolean {
        let person = data.studentList ? 'student' : 'employee';
        let currentPerson = data[person + 'List'].find(x => x.id == personId);
        let number = secondNumber ? 'secondMobileNumber' : 'mobileNumber';
        return previousList.some(personData => {
                return personData.mobileNumber == currentPerson[number] &&
                this.getMessageFromTemplate(message, this.getMappingData(eventVariables, data, person, personData.id)) ==
                    this.getMessageFromTemplate(message, this.getMappingData(eventVariables, data, person, personId));
            }
        );
    }
}
