import { Time as BaseTime } from '@services/modules/online-class/models/online-class';

export const WEEKDAY_KEYS_MAPPED_BY_DISPLAY_NAME = {
    'sunday': 'Sunday',
    'monday': 'Monday',
    'tuesday': 'Tuesday',
    'wednesday': 'Wednesday',
    'thursday': 'Thursday',
    'friday': 'Friday',
    'saturday': 'Saturday'
};

export class Time extends BaseTime {

    constructor(attributes: Partial<Time> = {}) {
        super();
        Object.entries(attributes).forEach(([key, value]) => this[key] = value);
    }

    getString(): string {   // can be feed to js Date constructor for html time selection
        const hours24 = this.ampm == 'am' ? this.hour : 12 + this.hour;
        return hours24.toString().padStart(2, '0') + ':' + this.minute.toString().padStart(2, '0');
    }

    getDisplayString(): string {
        const hours = this.hour == 0 ? 12 : this.hour;
        return hours.toString().padStart(2, '0') + ':' + this.minute.toString().padStart(2, '0') + ' ' + this.ampm;
    }

    diffInMinutes(time2: Time) {
        // with respect to 00:00
        const time1InMinutes = this.ampm == 'am' ? this.hour * 60 + this.minute : 12 * 60 + this.hour * 60 + this.minute;
        const time2InMinutes = time2.ampm == 'am' ? time2.hour * 60 + time2.minute : 12 * 60 + time2.hour * 60 + time2.minute;
        return time2InMinutes - time1InMinutes;
    }
}

export class TimeSpan {
    startTime: Time;
    endTime: Time;

    constructor(attributes: Partial<TimeSpan> = {}) {
        Object.entries(attributes).forEach(([key, value]) => this[key] = value);
    }
}

export function getDefaultTimeSpanList() {
    return [
        new TimeSpan({
            startTime: new Time({ hour: 8, minute: 0, ampm: 'am' }),
            endTime: new Time({ hour: 8, minute: 40, ampm: 'am' })
        }),
        new TimeSpan({
            startTime: new Time({ hour: 9, minute: 0, ampm: 'am' }),
            endTime: new Time({ hour: 9, minute: 40, ampm: 'am' })
        }),
        new TimeSpan({
            startTime: new Time({ hour: 10, minute: 0, ampm: 'am' }),
            endTime: new Time({ hour: 10, minute: 40, ampm: 'am' })
        }),
        new TimeSpan({
            startTime: new Time({ hour: 11, minute: 0, ampm: 'am' }),
            endTime: new Time({ hour: 11, minute: 40, ampm: 'am' })
        }),
    ];
}

export function TimeComparator(time1: Time, time2: Time) {
    const timeDiff = time2.diffInMinutes(time1);    // time1 - time2
    if (timeDiff < 0) { // time1 < time 2
        return -1;
    }
    else if (timeDiff > 0) {    // time1 > time 2
        return 1;
    }
    return 0;   // both ==
}


export function TimeSpanComparator(timeSpan1: TimeSpan, timeSpan2: TimeSpan) {
    const startTime1 = timeSpan1.startTime;
    const startTime2 = timeSpan2.startTime;
    return TimeComparator(startTime1, startTime2);
}

export const DEFAULT_START_TIME_STRING = '08:00';
export const DEFAULT_END_TIME_STRING = '08:40';


import { OnlineClass } from '@services/modules/online-class/models/online-class';
export interface ParsedOnlineClass extends OnlineClass {
    startTimeJSON: Time;
    endTimeJSON: Time;
}

export const ColorPalette = [
    ['pink', 'white'],
    ['darkgrey', 'white'],
    ['purple', 'white'],
    ['rgb(113, 122, 189)', 'white'],
    ['indigo', 'white'],
    ['blue', 'white'],
    ['lightblue', 'black'],
    ['cyan', 'black'],
    ['teal', 'white'],
    ['red', 'white'],
    ['green', 'white'],
    ['lightgreen', 'black'],
    ['lime', 'black'],
    ['yellow', 'black'],
    ['rgb(225, 196, 0)', 'black'],
    ['orange', 'black'],
    ['rgb(255, 66, 0)', 'white'],
    ['brown', 'white'],
    ['gery', 'black'],
    ['rgb(89, 125, 140)', 'white']
];
export class ColorPaletteHandle {
    static maxIndex = 0;
    static colorMappedBySubjectKey: { [key: string]: number; } = {};

    static getColorForSubject(subjectKey: string) {
        if (this.colorMappedBySubjectKey[subjectKey] == undefined) {
            this.colorMappedBySubjectKey[subjectKey] = this.maxIndex;
            this.maxIndex = (this.maxIndex + 1) % ColorPalette.length;
        }
        return ColorPalette[this.colorMappedBySubjectKey[subjectKey]][1];
    }

    static getBackgroundColorForSubject(subjectKey: string) {
        if (this.colorMappedBySubjectKey[subjectKey] == undefined) {
            this.colorMappedBySubjectKey[subjectKey] = this.maxIndex;
            this.maxIndex = (this.maxIndex + 1) % ColorPalette.length;
        }
        return ColorPalette[this.colorMappedBySubjectKey[subjectKey]][0];
    }

    static reset() {
        this.maxIndex = 0;
        this.colorMappedBySubjectKey = {};
    }
}

export const ZOOM_BASE_URL = 'https://zoom.us/j';