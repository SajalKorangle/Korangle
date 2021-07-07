
class SettingsPageStructure {
    static getStructure(pageName: any, eventsIdInOrder: any) {
        return {
            name: pageName,
            orderedSMSEventIdList: eventsIdInOrder,
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