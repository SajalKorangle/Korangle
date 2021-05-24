import { ClassroomComponent } from './classroom.component';
import { TimeSpan, TimeComparator, TimeSpanComparator, Time, ColorPaletteHandle, ParsedOnlineClass } from '@modules/online-classes/class/constants';

export class ClassroomHtmlRenderer {

    vm: ClassroomComponent;

    timeSpanList: Array<TimeSpan>;

    colorPaletteHandle = ColorPaletteHandle;

    meetingEntered: boolean = false;

    constructor() { }

    initialize(vm: ClassroomComponent): void {
        this.vm = vm;
    }

    initilizeTimeTable() {
        ColorPaletteHandle.reset();

        this.timeSpanList = [];
        this.vm.backendData.onlineClassList.forEach(onlineClass => {
            let result: boolean = false;
            this.timeSpanList.every(timeSpan => {
                if (TimeComparator(onlineClass.startTimeJSON, timeSpan.endTime) == -1
                    && TimeComparator(timeSpan.startTime, onlineClass.endTimeJSON) == -1) {
                    result = true;
                    return false;
                }
                return true;
            });
            if (!result) {
                this.timeSpanList.push(new TimeSpan(
                    {
                        startTime: new Time({ ...onlineClass.startTimeJSON }),
                        endTime: new Time({ ...onlineClass.endTimeJSON })
                    }));
            }
        });
        this.timeSpanList.sort(TimeSpanComparator);
    }

    getTime() {
        const currentTime = this.vm.currentTime;
        const customTime = new Time({
            hour: currentTime.getHours() % 12,
            minute: currentTime.getMinutes(),
            ampm: currentTime.getHours() >= 12 ? 'pm' : 'am',
        });
        return this.vm.currentTime.toDateString() + ' ' + customTime.getDisplayString();
    }

    getOnlineClassByWeekDayAndTime(weekdayKey, timespan) {
        return this.vm.backendData.onlineClassList.find(onlineClass => {
            if (onlineClass.day == this.vm.weekdays[weekdayKey]
                && TimeSpanComparator(timespan, new TimeSpan({ startTime: onlineClass.startTimeJSON, endTime: onlineClass.endTimeJSON })) == 0)
                return true;
            return false;
        });
    }

    getDisplayData(onlineClass: ParsedOnlineClass) {
        const classSubject = this.vm.backendData.getClassSubjectById(onlineClass.parentClassSubject);
        const subject = this.vm.backendData.getSubjectById(classSubject.parentSubject);
        return { classSubject, subject };
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
