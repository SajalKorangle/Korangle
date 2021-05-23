export const WEEKDAYS = {
    'sunday': 'Sunday',
    'monday': 'Monday',
    'tuesday': 'Tuesday',
    'wednesday': 'Wednesday',
    'thursday': 'Thursday',
    'friday': 'Friday',
    'saturday': 'Saturday'
};


export class Time {
    hour: number;
    minute: number;
    ampm: 'am' | 'pm';

    constructor(attributes: Partial<Time> = {}) {
        Object.entries(attributes).forEach(([key, value]) => this[key] = value);
    }

    getString(): string {
        const hours24 = this.ampm == 'am' ? this.hour : 12 + this.hour;
        return hours24.toString().padStart(2, '0') + ':' + this.minute.toString;
    }
}

export class MeetingDayConfig {
    startTime: Time;
    endTime: Time;

    constructor(attributes: Partial<MeetingDayConfig> = {}) {
        Object.entries(attributes).forEach(([key, value]) => this[key] = value);
    }
}

export function getDefaultTimeSpanList() {
    return [
        new MeetingDayConfig({
            startTime: new Time({ hour: 8, minute: 0, ampm: 'am' }),
            endTime: new Time({ hour: 8, minute: 40, ampm: 'am' })
        }),
        new MeetingDayConfig({
            startTime: new Time({ hour: 9, minute: 0, ampm: 'am' }),
            endTime: new Time({ hour: 9, minute: 40, ampm: 'am' })
        }),
        new MeetingDayConfig({
            startTime: new Time({ hour: 10, minute: 0, ampm: 'am' }),
            endTime: new Time({ hour: 10, minute: 40, ampm: 'am' })
        }),
        new MeetingDayConfig({
            startTime: new Time({ hour: 11, minute: 0, ampm: 'am' }),
            endTime: new Time({ hour: 11, minute: 40, ampm: 'am' })
        }),
    ];
}

export function TimeComparator(time1: Time, time2: Time) {
    // with respect to 00:00
    const time1InMinutes = time1.ampm == 'am' ? time1.hour * 60 + time1.minute : 12 * 60 + time1.hour * 60 + time1.minute;
    const time2InMinutes = time2.ampm == 'am' ? time2.hour * 60 + time2.minute : 12 * 60 + time2.hour * 60 + time2.minute;
    if (time1InMinutes < time2InMinutes) {
        return -1;
    }
    else if (time1InMinutes > time2InMinutes) {
        return 1;
    }
    return 0;
}


export function TimeSpanComparator(timespan1: MeetingDayConfig, timespan2: MeetingDayConfig) {
    const startTime1 = timespan1.startTime;
    const startTime2 = timespan2.startTime;
    return TimeComparator(startTime1, startTime2);
}

export const DEFAULT_START_TIME_STRING = '08:00';
export const DEFAULT_END_TIME_STRING = '08:40';

export interface TimeTable {
    'sunday': MeetingDayConfig;
    'monday': MeetingDayConfig;
    'tuesday': MeetingDayConfig;
    'wednesday': MeetingDayConfig;
    'thursday': MeetingDayConfig;
    'friday': MeetingDayConfig;
    'saturday': MeetingDayConfig;
}

export class MeetingConfiguration {
    timeTable: Partial<TimeTable> = {};
}