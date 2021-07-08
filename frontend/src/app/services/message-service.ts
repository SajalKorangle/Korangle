import {UserService} from './modules/user/user.service';
import {NotificationService} from './modules/notification/notification.service';
import {SmsService} from './modules/sms/sms.service';
import {NEW_LINE_REGEX, VARIABLE_MAPPED_EVENT_LIST} from '@modules/classes/constants';

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

export class MessageService {
    STUDENT_LIMITER = 200;
    notif_usernames = [];

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

    async sendEventNotification(
        Data, // contains all the backend list which are required to populate the variables
        personsList, // ['student','employee'] either or both of them
        eventId, // id of the Event like 'Homework Creation' = 7 as a number
        schoolId, // school dbId
        smsBalance, // school sms balance
    ) {

        const smsEvent = await this.smsService.getObject(this.smsService.sms_event, {id: eventId});
        if (!smsEvent) {
            throw "No Events Found";
        } // if there is not event return

        let fetch_event_settings_list = {
            SMSEventId: smsEvent.id,
            parentSchool: schoolId,
        };

        const eventSettings = await this.smsService.getObject(this.smsService.sms_event_settings, fetch_event_settings_list);
        if (!eventSettings || eventSettings.sendUpdateTypeId == 1) {
            return;
        } // if there is not event settings or sentUpdateType is null then return

        let customSMSTemplate, smsTemplate, messageContent;

        if (eventSettings.sendUpdateTypeId == 3) { //if the type is Notification
            messageContent = eventSettings.customNotificationContent ? eventSettings.customNotificationContent : smsEvent.defaultNotificationContent;
        } else {
            // if there is any templated linked with the settings get that template and populate
            if (eventSettings.parentSMSTemplate && eventSettings.parentSMSTemplate != 0) {
                customSMSTemplate = await this.smsService.getObject(this.smsService.sms_template,
                    {id: eventSettings.parentSMSTemplate});
            }
            if (customSMSTemplate) {
                smsTemplate = customSMSTemplate;
            } else {
                smsTemplate = await this.smsService.getObject(this.smsService.sms_default_template,
                    {id: smsEvent.defaultSMSTemplateId});
            }
            messageContent = smsTemplate.mappedContent;
        }


        try {
            await this.smsNotificationSender(
                Data,
                personsList,
                smsEvent,
                eventSettings.sendUpdateTypeId,
                smsTemplate,
                messageContent,
                null,
                schoolId,
                smsBalance
            );
        } catch (exception) {
            console.error(exception);
        }
    }

    async smsNotificationSender(
        data: any, // contains all the backend list which are required to populate the variables
        personsList: any, // ['student','employee'] either or both of them
        smsEvent: any, // corresponding SMS Event
        sendUpdateTypeId: any, // Sent Update Type [NULL,SMS,NOTIFICATION,SMS/NOTIF.]
        smsTemplate: any, // This contains any sms template that is used ( if not null )
        messageContent: any, // message content with mapped variables
        scheduledDateTime: any, // scheduled Date and Time
        schoolId: any, // school dbID
        smsBalance: any // sms balance for that school
    ) {

        let notification_list = [];
        let sms_list = [];
        let personVariablesMappedObjList = [];

        let smsId = smsTemplate ? smsTemplate.parentSMSId : null;

        // finding the corresponding eventSettingsPage to know the variablesList
        let variableMappedEvent = VARIABLE_MAPPED_EVENT_LIST.find(e => e.eventId == smsEvent.id);

        personsList.forEach(person => {
            data[person + 'List'].forEach(personData => {
                if (personData.mobileNumber && personData.mobileNumber.toString().length == 10) {
                    let mappedObject = this.getMappingData(variableMappedEvent.variableList, data, person, personData);
                    mappedObject['notification'] = personData.notification;
                    mappedObject['id'] = personData.id;
                    personVariablesMappedObjList.push(mappedObject);
                }
            });

        });

        if (sendUpdateTypeId == 2) {
            sms_list = personVariablesMappedObjList;
            notification_list = [];
        } else if (sendUpdateTypeId == 3) {
            sms_list = [];
            notification_list = personVariablesMappedObjList.filter((obj) => {
                return obj.notification;
            });
        } else {
            notification_list = personVariablesMappedObjList.filter((obj) => {
                return obj.notification;
            });
            sms_list = personVariablesMappedObjList.filter((obj) => {
                return !obj.notification;
            });
        }

        let notif_mobile_string = '';
        let sms_mobile_string = '';
        let smsMappedDataList = [];
        let notificationMappedDataList = [];

        notification_list.forEach((item) => {
            let temp = {
                mobileNumber: item.mobileNumber,
                content: this.getMessageFromTemplate(messageContent, item)
            };
            let duplicateData = notificationMappedDataList.some(x => x.mobileNumber == item.mobileNumber && x.content == temp.content);
            if (!duplicateData) {
                notif_mobile_string += item.mobileNumber + ', ';
                notificationMappedDataList.push(temp);
            }
        });

        sms_list.forEach((item) => {
            let temp = {
                Number: item.mobileNumber,
                Text: this.getMessageFromTemplate(messageContent, item),
                DLTTemplateId: smsTemplate.templateId
            };
            let duplicateData = smsMappedDataList.some(x => x.mobileNumber == temp.Number && x.Text == temp.Text);
            if (!duplicateData) {
                sms_mobile_string += item.mobileNumber + ', ';
                smsMappedDataList.push(temp);
            }
        });

        let smsCount = this.getEstimatedSMSCount(sendUpdateTypeId, smsMappedDataList);

        if (smsCount > smsBalance) {
            smsMappedDataList = [];
            smsCount = 0;
            sms_mobile_string = '';
        }

        sms_mobile_string = sms_mobile_string.slice(0, -2);
        notif_mobile_string = notif_mobile_string.slice(0, -2);

        let sms_data = {
            contentType: this.hasUnicode(messageContent) ? '1' : '0',
            SMSEventId: smsEvent.id,
            content: messageContent,
            parentMessageType: null,
            mobileNumberContentJson: JSON.stringify(smsMappedDataList),
            count: smsCount,
            notificationCount: notificationMappedDataList.length,
            notificationMobileNumberList: notif_mobile_string,
            mobileNumberList: sms_mobile_string,
            parentSchool: schoolId,
            scheduledDateTime: scheduledDateTime,
            smsId: smsId,
        };

        const notification_data = notificationMappedDataList.map((item) => {
            return {
                parentMessageType: null,
                SMSEventId: smsEvent.id,
                content: item.content,
                parentUser: this.notif_usernames.find((user) => {
                    return user.username == item.mobileNumber.toString();
                }).id,
                parentSchool: schoolId,
            };
        });

        console.log(sms_data);
        console.log(notification_data);

        let service_list = [];
        service_list.push(this.smsService.createObject(this.smsService.sms, sms_data));
        if (notification_data.length > 0) {
            service_list.push(this.notificationService.createObjectList(this.notificationService.notification, notification_data));
        }

        const value = await Promise.all(service_list);
        if ((sendUpdateTypeId == 2 || sendUpdateTypeId == 4) && sms_list.length > 0) {
            if (value[0].sentStatus) {
                smsBalance -= value[0].count;
            } else {
                throw "NOT SENT";
            }
        }

        return smsBalance;
    }

    getMessageFromTemplate = (message, mappedDataObj) => {
        let ret = message;
        for (let key in mappedDataObj) {
            ret = ret.replace(new RegExp('{#' + key + '#}', 'g'), mappedDataObj[key]);
        }
        ret = ret.replace(/{#/g, '').replace(/#}/g, '').replace(NEW_LINE_REGEX, "\n");
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

    getEstimatedSMSCount = (sendUpdateTypeId: any, student_list: any) => {
        let count = 0;
        if (sendUpdateTypeId == 3) {
            return 0;
        }
        student_list
            .filter((item) => item.Number)
            .forEach((item, i) => {
                if (sendUpdateTypeId == 2 || sendUpdateTypeId == 4) {
                    count += this.getMessageCount(item.Text);
                }
            });

        return count;
    }

    getEstimatedNotificationCount = (sendUpdateTypeId: any, student_list: any) => {
        let count = 0;
        if (sendUpdateTypeId == 2) {
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

    getMappingData(eventVariableList: any, data: any, person: any, personData: any) {
        let temp = {};
        data['person'] = person; // which person? student or employee is stored here
        data[person] = personData; // person details eg: data['student'] details are stored here
        eventVariableList.forEach(eventVariable => {
                temp[eventVariable.displayVariable] = eventVariable.getValueFunc(data);
        });
        return temp;
    }

    checkForDuplicate(eventVariables: any, previousList: any, data: any, currentPerson: any, message: any, person: any,
                      secondNumber: boolean = false): boolean {

        let number = secondNumber ? 'secondMobileNumber' : 'mobileNumber';
        return previousList.some(personData => {
                return personData.mobileNumber == currentPerson[number] &&
                this.getMessageFromTemplate(message, this.getMappingData(eventVariables, data, person, personData)) ==
                    this.getMessageFromTemplate(message, this.getMappingData(eventVariables, data, person, currentPerson));
            }
        );
    }
}
