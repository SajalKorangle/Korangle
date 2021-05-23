export type WEEKDAYS_CHOICES = 'Sunday' | 'Monday' | 'Tuesday' | 'Wednesday' | 'Thursday' | 'Friday' | 'Saturday';

export class OnlineClass {
    parentSchool: number;
    parentClassSubject: number;
    parentAccountInfo: number | null;
    day: WEEKDAYS_CHOICES;
    meetingNumber: number | null;
    password: string | null;
    startTimeJSON: { [key: string]: any; };
    endTimeJSON: { [key: string]: any; };
}

