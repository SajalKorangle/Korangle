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
    notif_usernames = [];

    notificationService: any;
    userService: any;
    smsService: any;

    constructor(notificationService: NotificationService, userService: UserService, smsService: SmsService) {
        this.notificationService = notificationService;
        this.userService = userService;
        this.smsService = smsService;
    }


    //// FETCHING GCM DEVICES PART STARTS TO POPULATE THE KEY NOTIFICATION(TRUE OR FALSE) FOR ANY PERSON ////

    fetchGCMDevicesNew: any = async (personList: any, checkSecondNumber: boolean = false) => {
        const mobile_list = personList.filter((item) => item.mobileNumber).map((obj) => {
            let return_str = obj.mobileNumber.toString();
            if (checkSecondNumber && obj.secondMobileNumber) {
                return_str = return_str + ',' + obj.secondMobileNumber.toString();
            }
            return return_str;
        });
        const gcm_data = {
            user__username__in: mobile_list,
            active: 'true__boolean',
        };
        const user_data = {
            fields__korangle: 'username,id',
            username__in: mobile_list,
        };

        let temp_gcm_list, temp_user_list;
        [temp_gcm_list, temp_user_list] = await Promise.all([
            this.notificationService.getObjectList(this.notificationService.gcm_device, gcm_data),
            this.userService.getObjectList(this.userService.user, user_data)
        ]);

        const notif_usernames = temp_user_list.filter((user) => {
            return (
                temp_gcm_list.find((item) => {
                    return item.user == user.id;
                }) != undefined
            );
        });

        // Storing because they're used later
        this.notif_usernames = notif_usernames;

        // updating two variables (notification - for actual number notification check)
        // (secondNumberNotification - for second number notification check)
        personList.forEach((person) => {
            person.notification = notif_usernames.some(user => {
                return user.username == person.mobileNumber;
            });
            person.secondNumberNotification = person.secondMobileNumber && notif_usernames.some(user => {
                return user.username == person.secondMobileNumber;
            });
        });
    }


    //// END OF FETCHING GCM DEVICES PART ////


    //// START OF SENDING SMS AND NOTIFICATIONS RELATED FUNCTIONS ////

    /*
     This sendEventNotification function is called by all the Automated Events like Tutorials,Homework,Event-Gallery because to
     avoid code repetition ( like - fetching the smsEventData smseventSettings data in all the pages )
     */

    async fetchEventDataAndSendEventSMSNotification(
        dataForMapping, // contains all the backend list which are required to populate the variables
        personType, // 'student' or 'employee' or  'commonPerson'
        eventId, // id of the Event like 'Homework Creation' = 7 as a number
        schoolId, // school dbId
        smsBalance, // school sms balance
    ) {

        const smsEvent = await this.smsService.getObject(this.smsService.sms_event, {id: eventId});
        if (!smsEvent) {
            throw 'No Events Found';
        } // if there is not event return

        let fetch_event_settings_list = {
            SMSEventId: smsEvent.id,
            parentSchool: schoolId,
        };

        const eventSettings = await this.smsService.getObject(this.smsService.sms_event_settings, fetch_event_settings_list);
        if (!eventSettings || eventSettings.sendUpdateTypeId == 1) {
            return;
        } // if there is not event settings or sentUpdateType is null then return

        let smsDefaultTemplate = await this.smsService.getObject(this.smsService.sms_default_template,
            {id: smsEvent.defaultSMSTemplateId});

        let messageContent;
        if (eventSettings.sendUpdateTypeId == 3) { //if the type is Notification
            messageContent = eventSettings.customNotificationContent ? eventSettings.customNotificationContent : smsEvent.defaultNotificationContent;
        } else {
            // if there is any template linked with the settings get that template and store it
            if (eventSettings.parentSMSTemplate) {
                smsDefaultTemplate = await this.smsService.getObject(this.smsService.sms_template,
                    {id: eventSettings.parentSMSTemplate});
            }
            messageContent = smsDefaultTemplate.mappedContent;
        }

        try {
            await this.sendEventSMSNotification(
                dataForMapping,
                personType,
                smsEvent,
                eventSettings.sendUpdateTypeId,
                smsDefaultTemplate,
                messageContent,
                null,
                schoolId,
                smsBalance
            );
        } catch (exception) {
            console.error(exception);
        }
    }

    /*
    smsNotificationSender is called by the AutomatedEvents function sendEventNotification and
    For SendGeneralSMS and NotifyDefaultersSMS this function is called directly from the respective pages
    as they don't have any smsEventSettings and the pages contain the smsContent by themselves
    */

    async sendEventSMSNotification(
        dataForMapping: any, // contains all the backend list which are required to populate the variables
        personsType: any, // 'student' or 'employee' or 'commonPerson'
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

        let parentSMSId = null;
        let parentSMSTemplate = null;
        if (smsTemplate) {
            parentSMSId = smsTemplate.parentSMSId;
            parentSMSTemplate = smsTemplate.id;
        }

        // finding the corresponding eventSettingsPage to know the variablesList
        let variableMappedEvent = VARIABLE_MAPPED_EVENT_LIST.find(e => e.eventId == smsEvent.id);

        // Iterating over the person Type list because in Event-Gallery we require both Students and Employees
        // So it is determined by the function caller
        dataForMapping[personsType + 'List'].forEach(personData => {
            if (personData.mobileNumber && personData.mobileNumber.toString().length == 10) {
                // Getting the mapped data like - { studentName : "Rahul", class: "10" ... etc }
                let mappedObject = this.getMappingData(variableMappedEvent.variableList, dataForMapping, personsType, personData);

                // Checking if it is secondNumber element, if yes checking whether the notification is true for secondNumber
                if (personData.isSecondNumber && personData.secondNumberNotification) {
                    // if includeSecondMobile number is selected, a duplicate entry of the same person added with the following variables
                    // (personData.mobileNumber = secondMobileNumber),(personData.isSecondNumber = True),(personData.secondNumberNotification = True | False)
                    mappedObject['notification'] = personData.secondNumberNotification;
                } else {
                    mappedObject['notification'] = personData.notification;
                }

                mappedObject['id'] = personData.id;
                personVariablesMappedObjList.push(mappedObject);
            }
        });

        if (sendUpdateTypeId == 2) { // if the update type is 2 (SMS) populating only the sms_list
            sms_list = personVariablesMappedObjList;
            notification_list = [];
        } else if (sendUpdateTypeId == 3) { // if the update type is 3 (NOTIFICATION) populating only the notification_list
            sms_list = [];
            notification_list = personVariablesMappedObjList.filter((obj) => {
                return obj.notification;
            });
        } else { // populating both
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
                // Getting the exact message from the template format text (for eg: by replacing the {#studentName#} with Rahul)
                content: this.getMessageFromTemplate(messageContent, item)
            };
            let duplicateData = notificationMappedDataList.some(x => x.mobileNumber == item.mobileNumber && x.content == temp.content);
            if (!duplicateData) { // if there is no duplicate data with same number and same message then pushing
                notif_mobile_string += item.mobileNumber + ', ';
                notificationMappedDataList.push(temp);
            }
        });

        sms_list.forEach((item) => {
            let temp = {
                Number: item.mobileNumber,
                // Getting the exact message from the template format text (for eg: by replacing the {#studentName#} with Rahul)
                Text: this.getMessageFromTemplate(messageContent, item),
                DLTTemplateId: smsTemplate.templateId
            };
            let duplicateData = smsMappedDataList.some(x => x.Number == temp.Number && x.Text == temp.Text);
            if (!duplicateData) { // if there is no duplicate data with same number and same message then pushing
                sms_mobile_string += item.mobileNumber + ', ';
                smsMappedDataList.push(temp);
            }
        });

        let smsCount = this.getEstimatedSMSCount(sendUpdateTypeId, smsMappedDataList);

        if (smsCount > smsBalance) { // if balance is low not sending any SMS ( but notification is sent )
            smsMappedDataList = [];
            smsCount = 0;
            sms_mobile_string = '';
        }

        if (smsCount == 0 && notificationMappedDataList.length == 0) {
            // console.log("Zero Count");
            return;
        }

        sms_mobile_string = sms_mobile_string.slice(0, -2);
        notif_mobile_string = notif_mobile_string.slice(0, -2);

        let sms_data = {
            contentType: this.hasUnicode(messageContent) ? '8' : '0', // 8 is the DCS Code give by vendor for unicode messages
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
            parentSMSId: parentSMSId,
            parentSMSTemplate: parentSMSTemplate,
            payload: null,
            response: null
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

        // console.log(sms_data);
        // console.log(notification_data);

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
                throw 'NOT SENT';
            }
        }

        return smsBalance;
    }

    //// HELPER FUNCTIONS PART STARTS ////

    getMessageFromTemplate = (message, mappedDataObj) => {
        let ret = message;
        for (let key in mappedDataObj) {
            ret = ret.replace(new RegExp('{#' + key + '#}', 'g'), mappedDataObj[key]);
        }
        ret = ret.replace(/{#/g, '').replace(/#}/g, '').replace(NEW_LINE_REGEX, '\n');
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

    getMessageCount = (message) => {
        if (this.hasUnicode(message)) {
            return Math.ceil(message.length / 70);
        } else {
            return Math.ceil(message.length / 160);
        }
    }

    getMappingData(eventVariableList: any, data: any, person: any, personData: any) {
        let temp = {};
        data['person'] = person; // which person? student or employee or commonPerson is stored here
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

    //// HELPER FUNCTIONS PART ENDS ////

    //// END OF SENDING SMS AND NOTIFICATIONS RELATED FUNCTIONS ////

}
