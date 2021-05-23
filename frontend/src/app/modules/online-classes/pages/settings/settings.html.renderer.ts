import { SettingsComponent } from './settings.component';
import { getDefaultTimeSpanList, TimeComparator, TimeSpanComparator, Time, MeetingDayConfig, MeetingConfiguration } from '@modules/online-classes/class/constants';

export class SettingsHtmlRenderer {

    vm: SettingsComponent;

    newTimeSpanForm: boolean = false;
    editTimeSpanFormIndex: number = -1;

    filteredOnlineClassList: Array<{ [key: string]: any, configJSON: MeetingConfiguration; }> = [];

    constructor() { }

    initialize(vm: SettingsComponent): void {
        this.vm = vm;
    }

    initilizeTimeTable() {
        if (!(this.vm.userInput.selectedClass && this.vm.userInput.selectedSection))
            return;
        this.filteredOnlineClassList = this.vm.backendData.onlineClassList.filter((onlineClass) => {    // filter online classes for selected class and section
            const classSubject = this.vm.backendData.classSubjectList.find(cs => cs.id == onlineClass.parentClassSubject);
            if (classSubject.parentClass == this.vm.userInput.selectedClass.id
                && classSubject.parentDivision == this.vm.userInput.selectedSection.id) {
                return true;
            }
            return false;
        });
        this.editTimeSpanFormIndex = -1;
        this.newTimeSpanForm = false;
        this.vm.userInput.timeSpanList = [];
        this.filteredOnlineClassList.forEach(onlineCass => {
            Object.values(onlineCass.configJSON.timeTable).forEach(meetConfigDay => {
                let result: boolean = false;
                this.vm.userInput.timeSpanList.every(timeSpan => {
                    if (TimeComparator(meetConfigDay.startTime, timeSpan.endTime) == -1
                        && TimeComparator(timeSpan.startTime, meetConfigDay.endTime) == -1) {
                        result = true;
                        return false;
                    }
                    return true;
                });
                if (!result) {
                    this.vm.userInput.timeSpanList.push(new MeetingDayConfig(
                        {
                            startTime: new Time({ ...meetConfigDay.startTime }),
                            endTime: new Time({ ...meetConfigDay.endTime })
                        }));
                }
            });
        });
        if (this.vm.userInput.timeSpanList.length == 0) {
            this.vm.userInput.timeSpanList = getDefaultTimeSpanList();
        }
        this.vm.userInput.timeSpanList.sort(TimeSpanComparator);
    }

    getOnlineClassByWeekDayAndTime(weekday, meetConfigDay) {
        this.filteredOnlineClassList.find(onlineClass => {
            if (onlineClass.configJSON.timeTable[weekday]
                && TimeSpanComparator(meetConfigDay, onlineClass.configJSON.timeTable[weekday]) == 0)
                return true;
            return false;
        });
    }

    getDisplayData(onlineClass) {
        const classSubject = this.vm.backendData.getClassSubjectById(onlineClass.parentClassSubject);
        const subject = this.vm.backendData.getSubjectById(classSubject.parentSubject);
        const employee = this.vm.backendData.getEmployeeById(classSubject.parentEmployee);
        return { classSubject, subject, employee };
    }

    getClassDivisionName(classId, divisionId) {
        const classInstance = this.vm.backendData.classList.find(c => c.id == classId);
        const divisionInstance = this.vm.backendData.divisionList.find(d => d.id == divisionId);
        return classInstance.name + ' - ' + divisionInstance.name;
    }

    setupEditTimeSpan() {
        this.vm.userInput.newTimeSpan = {
            startTime: this.vm.userInput.timeSpanList[this.editTimeSpanFormIndex].startTime.getString(),
            endTime: this.vm.userInput.timeSpanList[this.editTimeSpanFormIndex].endTime.getString()
        };
    }

    endTimeBeforeStartTime(): boolean {
        const startTimeArray = this.vm.userInput.newTimeSpan.startTime.split(':').map(t => parseInt(t));
        const endTimeArray = this.vm.userInput.newTimeSpan.endTime.split(':').map(t => parseInt(t));
        if (endTimeArray[0] < startTimeArray[0])
            return true;
        else if (endTimeArray[0] == startTimeArray[0] && endTimeArray[1] < startTimeArray[1])
            return true;
        return false;
    }

    timeSpanOverlapping(): boolean {
        const startTimeArray = this.vm.userInput.newTimeSpan.startTime.split(':').map(t => parseInt(t));
        const endTimeArray = this.vm.userInput.newTimeSpan.endTime.split(':').map(t => parseInt(t));
        const newStartTime = new Time({ hour: startTimeArray[0] % 12, minute: startTimeArray[1], ampm: startTimeArray[0] < 12 ? 'am' : 'pm' });
        const newEndTime = new Time({ hour: endTimeArray[0] % 12, minute: endTimeArray[1], ampm: endTimeArray[0] < 12 ? 'am' : 'pm' });
        let result: boolean = false;

        const filteredTimeSpans = this.nonEditingTimeSpanList();
        filteredTimeSpans.every(timeSpan => {
            if (TimeComparator(newStartTime, timeSpan.endTime) == -1
                && TimeComparator(timeSpan.startTime, newEndTime) == -1) {
                result = true;
                return false;
            }
            return true;
        });
        return result;
    }

    nonEditingTimeSpanList(): Array<MeetingDayConfig> {
        return this.vm.userInput.timeSpanList.filter((timeSpan, timeSpanIndex) => timeSpanIndex != this.editTimeSpanFormIndex);
    }

    newTimeSpanError = (): boolean => {
        if (this.endTimeBeforeStartTime() || this.timeSpanOverlapping())
            return true;
        return false;
    };

    editTimeSpanError = (): boolean => {
        if (this.endTimeBeforeStartTime() || this.timeSpanOverlapping())
            return true;
        return false;
    };

}
