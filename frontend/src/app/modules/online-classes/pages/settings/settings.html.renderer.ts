import { SettingsComponent } from './settings.component';
import { TimeComparator, Time, TimeSpan } from '@modules/online-classes/class/constants';

export class SettingsHtmlRenderer {

    vm: SettingsComponent;

    newTimeSpanForm: boolean = false;
    editTimeSpanFormIndex: number = -1;

    constructor() { }

    initialize(vm: SettingsComponent): void {
        this.vm = vm;
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

    nonEditingTimeSpanList(): Array<TimeSpan> {
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
