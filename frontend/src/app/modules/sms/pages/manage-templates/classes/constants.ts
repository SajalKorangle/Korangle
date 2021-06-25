import {SMS_EVENT_LIST} from '@modules/constants-database/SMSEvent';

class SettingsPageStructure {
    static getStructure(pageName: any, eventsIdInOrder: any) {
        let orderedEventList = [];
        eventsIdInOrder.forEach(e => orderedEventList.push(SMS_EVENT_LIST.find(x => x.id == e)));
        return {
            name: pageName,
            orderedSMSEventList: orderedEventList,
        };
    }
}

export const EVENT_SETTING_PAGES = [
    SettingsPageStructure.getStructure('General SMS', [1, 2, 3]),
    SettingsPageStructure.getStructure('Notify Defaulters', [4]),
    SettingsPageStructure.getStructure('Attendance', [5, 6]),
    SettingsPageStructure.getStructure('Homework', [7, 8, 9, 10, 11]),
    SettingsPageStructure.getStructure('Tutorial', [12, 13, 14]),
    SettingsPageStructure.getStructure('Event Gallery', [15, 16, 17])
];