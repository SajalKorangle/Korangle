export type WEEKDAYS_CHOICES = 'Sunday' | 'Monday' | 'Tuesday' | 'Wednesday' | 'Thursday' | 'Friday' | 'Saturday';

export class OnlineClass {
    id?: number;
    parentClassSubject: number;
    day: WEEKDAYS_CHOICES;
    startTimeJSON: Time;
    endTimeJSON: Time;
}


export class Time {
    hour: number;
    minute: number;
    ampm: 'am' | 'pm';
}