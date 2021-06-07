export type WEEKDAYS_CHOICES = 'Sunday' | 'Monday' | 'Tuesday' | 'Wednesday' | 'Thursday' | 'Friday' | 'Saturday';

export class OnlineClass {
    id?: number;
    parentClassSubject: number;
    day: WEEKDAYS_CHOICES;
    startTimeJSON: { [key: string]: any; };
    endTimeJSON: { [key: string]: any; };
}

