import { ClassroomComponent } from './classroom.component';
import { TimeComparator, Time, ColorPaletteHandle, ParsedOnlineClass } from '@modules/online-classes/class/constants';
export class ClassroomHtmlRenderer {

    vm: ClassroomComponent;

    timeBreakPoints: Array<Time>;

    colorPaletteHandle = ColorPaletteHandle;

    constructor() { }

    initialize(vm: ClassroomComponent): void {
        this.vm = vm;
    }

    getCurrentTime() {
        const currentTime = this.vm.currentTime;
        const customTime = new Time({
            hour: currentTime.getHours() % 12,
            minute: currentTime.getMinutes(),
            ampm: currentTime.getHours() >= 12 ? 'pm' : 'am',
        });
        return customTime.getDisplayString();
    }

    getCardSlotDisplayData(onlineClass: ParsedOnlineClass) {
        const classSubject = this.vm.backendData.getClassSubjectById(onlineClass.parentClassSubject);
        const subject = this.vm.backendData.getSubjectById(classSubject.parentSubject);
        const classInstance = this.vm.backendData.getClassById(classSubject.parentClass);
        const division = this.vm.backendData.getDivisionById(classSubject.parentDivision);
        return { subject, classInstance, division };
    }

    isActive(onlineClass: ParsedOnlineClass): boolean {
        const currentTime = this.vm.currentTime;
        const customTime = new Time({
            hour: currentTime.getHours() % 12,
            minute: currentTime.getMinutes(),
            ampm: currentTime.getHours() >= 12 ? 'pm' : 'am',
        });

        const timeDiffStart = onlineClass.startTimeJSON.diffInMinutes(customTime);
        const timeDiffEnd = onlineClass.endTimeJSON.diffInMinutes(customTime);
        if (timeDiffStart >= 0 && timeDiffEnd <= 0) {
            return true;
        }
        return false;
    }

    getActiveClass() {
        return this.vm.backendData.onlineClassList.find(onlineClass => onlineClass.day == this.vm.today && this.isActive(onlineClass));
    }

    getOnlineClassByWeekDayAndStartTime(weekdayKey, startTime: Time) {
        return this.vm.backendData.onlineClassList.find(onlineClass => {
            if (onlineClass.day == this.vm.weekdays[weekdayKey]
                && TimeComparator(startTime, onlineClass.startTimeJSON) == 0)
                return true;
            return false;
        });
    }

    getOnlineClassRowSpan(onlineClass: ParsedOnlineClass): number {
        const startTimeIndex = this.timeBreakPoints.findIndex(time => {
            return TimeComparator(time, onlineClass.startTimeJSON) == 0;
        });
        const endTimeIndex = this.timeBreakPoints.findIndex(time => {
            return TimeComparator(time, onlineClass.endTimeJSON) == 0;
        });
        return endTimeIndex - startTimeIndex;
    }

    isCellOccupiedDueToRowspan(weekdayKey, time: Time) {
        return this.vm.backendData.onlineClassList.find(onlineClass => {
            if (onlineClass.day == this.vm.weekdays[weekdayKey]
                && TimeComparator(time, onlineClass.startTimeJSON) >= 0
                && TimeComparator(time, onlineClass.endTimeJSON) < 0)
                return true;
            return false;
        }) == undefined;
    }

}
