import { SettingsComponent } from './settings.component';
import { getDefaultTimeSpanList, MeetingDayConfig, Time, DEFAULT_START_TIME_STRING, DEFAULT_END_TIME_STRING, TimeSpanComparator } from '@modules/online-classes/class/constants';

export class SettingsUserInput {

    selectedClass: any;
    selectedSection: any;

    timeSpanList: Array<MeetingDayConfig> = getDefaultTimeSpanList();

    // timeTabel: Array<any>;

    newTimeSpan: { startTime: string, endTime: string; } = { startTime: DEFAULT_START_TIME_STRING, endTime: DEFAULT_END_TIME_STRING };

    vm: SettingsComponent;

    constructor() { }

    initialize(vm: SettingsComponent): void {
        this.vm = vm;
    }

    addNewTimeSpan() {
        const startTimeArray = this.newTimeSpan.startTime.split(':').map(t => parseInt(t));
        const endTimeArray = this.newTimeSpan.endTime.split(':').map(t => parseInt(t));
        const startTime = new Time({ hour: startTimeArray[0] % 12, minute: startTimeArray[1], ampm: startTimeArray[0] < 12 ? 'am' : 'pm' });
        const endTime = new Time({ hour: endTimeArray[0] % 12, minute: endTimeArray[1], ampm: endTimeArray[0] < 12 ? 'am' : 'pm' });
        this.timeSpanList.push(new MeetingDayConfig({ startTime, endTime }));
        this.timeSpanList.sort(TimeSpanComparator);
        this.newTimeSpan = { startTime: DEFAULT_START_TIME_STRING, endTime: DEFAULT_END_TIME_STRING }; // revert to default
    }

    editTimeSpan() {
        const startTimeArray = this.newTimeSpan.startTime.split(':').map(t => parseInt(t));
        const endTimeArray = this.newTimeSpan.endTime.split(':').map(t => parseInt(t));
        const startTime = new Time({ hour: startTimeArray[0] % 12, minute: startTimeArray[1], ampm: startTimeArray[0] < 12 ? 'am' : 'pm' });
        const endTime = new Time({ hour: endTimeArray[0] % 12, minute: endTimeArray[1], ampm: endTimeArray[0] < 12 ? 'am' : 'pm' });
        this.timeSpanList[this.vm.htmlRenderer.editTimeSpanFormIndex].startTime = startTime;
        this.timeSpanList[this.vm.htmlRenderer.editTimeSpanFormIndex].endTime = endTime;
        this.timeSpanList.sort(TimeSpanComparator);
        this.newTimeSpan = { startTime: DEFAULT_START_TIME_STRING, endTime: DEFAULT_END_TIME_STRING };  // revert to default
        this.vm.htmlRenderer.editTimeSpanFormIndex = -1;    //close editing form
    }

}
