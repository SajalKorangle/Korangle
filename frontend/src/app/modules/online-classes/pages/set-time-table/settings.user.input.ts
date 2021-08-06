import { SettingsComponent } from './settings.component';
import {
    DEFAULT_START_TIME_STRING, DEFAULT_END_TIME_STRING, ParsedOnlineClass, getDefaultTimeSpanList,
    TimeSpan, TimeComparator, Time, TimeSpanComparator
} from '@modules/online-classes/class/constants';

export class SettingsUserInput {

    selectedClass: any;
    selectedSection: any;

    selectedEmployee: any;

    timeSpanFormInput: { startTime: string, endTime: string; };
    employeeTimeBreakPoints: Array<Time>;


    private _timeSpanList: Array<TimeSpan> = getDefaultTimeSpanList();

    newTimeSpanForm: boolean = false;
    editTimeSpanFormIndex: number = -1;

    private _filteredOnlineClassList: Array<ParsedOnlineClass> = [];

    view: 'class' | 'employee' = 'class';

    vm: SettingsComponent;

    constructor() {
        this.resetNewTimeSpanData();
    }

    initialize(vm: SettingsComponent): void {
        this.vm = vm;
    }

    get filteredOnlineClassList() {
        return this._filteredOnlineClassList;
    }

    set filteredOnlineClassList(onlineClassListValue: Array<ParsedOnlineClass>) {
        this.timeSpanList = []; // reset the time span list
        this.employeeTimeBreakPoints = [];
        onlineClassListValue.sort((a, b) => b.id - a.id);   // sorted in descending order of id to make the next filtering process always consistent

        onlineClassListValue.forEach((concernedOnlineClass) => {     // filter out online classes thar are overlapping
            if (!concernedOnlineClass)
                return;
            const bookedSlotOnlineClassIndex = onlineClassListValue.findIndex(onlineClass => {
                if (onlineClass.id == concernedOnlineClass.id) {
                    return false;
                }
                if (concernedOnlineClass.day == onlineClass.day
                    && TimeComparator(concernedOnlineClass.startTimeJSON, onlineClass.endTimeJSON) < 0
                    && TimeComparator(onlineClass.startTimeJSON, concernedOnlineClass.endTimeJSON) < 0) {
                    return true;
                }
            });
            if (bookedSlotOnlineClassIndex != -1) {
                onlineClassListValue.splice(bookedSlotOnlineClassIndex, 1);
            }
        });
        this._filteredOnlineClassList = onlineClassListValue;
        const timeSpanList: Array<TimeSpan> = [];
        if (this.view == 'class') {
            onlineClassListValue.forEach(onlineClass => {
                const timeSpanNotFound = timeSpanList.every(timeSpan => {
                    if (TimeComparator(onlineClass.startTimeJSON, timeSpan.endTime) == -1
                        && TimeComparator(timeSpan.startTime, onlineClass.endTimeJSON) == -1) {
                        return false;
                    }
                    return true;
                });
                if (timeSpanNotFound) {
                    timeSpanList.push(new TimeSpan(
                        {
                            startTime: new Time({ ...onlineClass.startTimeJSON }),
                            endTime: new Time({ ...onlineClass.endTimeJSON })
                        }));
                }
            });
            if (timeSpanList.length == 0) {
                this.timeSpanList = getDefaultTimeSpanList();
            }
            else {
                this.timeSpanList = timeSpanList;
            }
        }
        else {
            onlineClassListValue.forEach(onlineClass => {
                let startTimeAlreadyPresent: boolean = false;
                let endTimeAlreadyPresent: boolean = false;
                this.employeeTimeBreakPoints.forEach(timeSpan => {
                    if (TimeComparator(onlineClass.startTimeJSON, timeSpan) == 0) {
                        startTimeAlreadyPresent = true;
                    }
                    if (TimeComparator(onlineClass.endTimeJSON, timeSpan) == 0) {
                        endTimeAlreadyPresent = true;
                    }
                });
                if (!startTimeAlreadyPresent) {
                    this.employeeTimeBreakPoints.push(new Time({ ...onlineClass.startTimeJSON }));
                }
                if (!endTimeAlreadyPresent) {
                    this.employeeTimeBreakPoints.push(new Time({ ...onlineClass.endTimeJSON }));
                }
            });
            this.employeeTimeBreakPoints.sort(TimeComparator);
        }
    }

    get timeSpanList() {
        return this._timeSpanList;
    }

    set timeSpanList(timeSpanListValue) {
        timeSpanListValue.sort(TimeSpanComparator);
        this._timeSpanList = timeSpanListValue;
    }

    resetNewTimeSpanData() {
        this.timeSpanFormInput = { startTime: DEFAULT_START_TIME_STRING, endTime: DEFAULT_END_TIME_STRING };
    }

    resetInput() {
        this.selectedEmployee = null;
        this.selectedClass = null;
        this.selectedSection = null;
    }

}
