import { ClassroomComponent } from './classroom.component';
import { TimeSpan, TimeComparator, TimeSpanComparator, Time, ColorPaletteHandle, ParsedOnlineClass } from '@modules/online-classes/class/constants';
export class ClassroomHtmlRenderer {

    vm: ClassroomComponent;

    timeSpanList: Array<Time>;

    colorPaletteHandle = ColorPaletteHandle;

    constructor() { }

    initialize(vm: ClassroomComponent): void {
        this.vm = vm;
    }

    initilizeTimeTable() {
        ColorPaletteHandle.reset();

        this.timeSpanList = [];
        this.vm.backendData.onlineClassList.forEach(onlineClass => {
            let startTimeAlreadyPresent: boolean = false;
            let endTimeAlreadyPresent: boolean = false;
            this.timeSpanList.forEach(timeSpan => {
                if (TimeComparator(onlineClass.startTimeJSON, timeSpan) == 0) {
                    startTimeAlreadyPresent = true;
                }
                if (TimeComparator(onlineClass.endTimeJSON, timeSpan) == 0) {
                    endTimeAlreadyPresent = true;
                }
            });
            if (!startTimeAlreadyPresent) {
                this.timeSpanList.push(new Time({ ...onlineClass.startTimeJSON }));
            }
            if (!endTimeAlreadyPresent) {
                this.timeSpanList.push(new Time({ ...onlineClass.endTimeJSON }));
            }
        });
        this.timeSpanList.sort(TimeComparator);
    }

    getTime() {
        const currentTime = this.vm.currentTime;
        const customTime = new Time({
            hour: currentTime.getHours() % 12,
            minute: currentTime.getMinutes(),
            ampm: currentTime.getHours() >= 12 ? 'pm' : 'am',
        });
        return customTime.getDisplayString();
    }

    getOnlineClassByWeekDayAndStartTime(weekdayKey, time: Time) {
        return this.vm.backendData.onlineClassList.find(onlineClass => {
            if (onlineClass.day == this.vm.weekdays[weekdayKey]
                && TimeComparator(time, onlineClass.startTimeJSON) == 0)
                return true;
            return false;
        });
    }

    getOnlineClassRowSpan(onlineClass: ParsedOnlineClass): number {
        const startTimeIndex = this.timeSpanList.findIndex(time => {
            return TimeComparator(time, onlineClass.startTimeJSON) == 0;
        });
        const endTimeIndex = this.timeSpanList.findIndex(time => {
            return TimeComparator(time, onlineClass.endTimeJSON) == 0;
        });
        return endTimeIndex - startTimeIndex;
    }

    getDisplayData(onlineClass: ParsedOnlineClass) {
        const classSubject = this.vm.backendData.getClassSubjectById(onlineClass.parentClassSubject);
        const subject = this.vm.backendData.getSubjectById(classSubject.parentSubject);
        const classInstane = this.vm.backendData.getClassById(classSubject.parentClass);
        const division = this.vm.backendData.getDivisionById(classSubject.parentDivision);
        return { classSubject, subject, classInstane, division };
    }

    isActiveTime(time: Time): boolean {
        const activeClass = this.getActiveClass();
        if (!activeClass)
            return false;

        if (TimeComparator(activeClass.startTimeJSON, time) <= 0
            && TimeComparator(time, activeClass.endTimeJSON) < 0) {
            return true;
        }
        return false;
    }

    shouldRenderEmptyTd(weekdayKey, time: Time) {
        return this.vm.backendData.onlineClassList.find(onlineClass => {
            if (onlineClass.day == this.vm.weekdays[weekdayKey]
                && TimeComparator(time, onlineClass.startTimeJSON) >= 0
                && TimeComparator(time, onlineClass.endTimeJSON) < 0)
                return true;
            return false;
        }) == undefined;
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

}
