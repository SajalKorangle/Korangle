import { ClassroomComponent } from './classroom.component';
import { TimeSpan, TimeComparator, TimeSpanComparator, Time, ColorPaletteHandle, ParsedOnlineClass } from '@modules/online-classes/class/constants';

export class ClassroomHtmlRenderer {

    vm: ClassroomComponent;

    colorPaletteHandle = ColorPaletteHandle;

    meetingEntered: boolean = false;

    constructor() { }

    initialize(vm: ClassroomComponent): void {
        this.vm = vm;
        ColorPaletteHandle.reset();
    }

    getOverlappingFilteredOnlineClassList(): Array<ParsedOnlineClass> {
        const onlineClassList = [...this.vm.backendData.onlineClassList];
        onlineClassList.forEach((concernedOnlineClass) => {
            if (!concernedOnlineClass)
                return;
            onlineClassList.forEach((onlineClass, index) => {
                if (onlineClass.id == concernedOnlineClass.id) {
                    return false;
                }
                if (concernedOnlineClass.day == onlineClass.day
                    && TimeComparator(concernedOnlineClass.startTimeJSON, onlineClass.endTimeJSON) < 0
                    && TimeComparator(onlineClass.startTimeJSON, concernedOnlineClass.endTimeJSON) < 0) {
                    onlineClassList.splice(index, 1);
                }
            });
        });
        return onlineClassList;
    }

    getTimeSpanList(): Array<TimeSpan> {

        const timeSpanList: Array<TimeSpan> = [];
        this.getOverlappingFilteredOnlineClassList().forEach(onlineClass => {
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
        timeSpanList.sort(TimeSpanComparator);
        return timeSpanList;
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

    getOnlineClassByWeekDayAndTime(weekdayKey, timeSpan) {
        return this.getOverlappingFilteredOnlineClassList().find(onlineClass => {
            if (onlineClass.day == this.vm.weekdayKeysMappedByDisplayName[weekdayKey]
                && TimeSpanComparator(timeSpan, new TimeSpan({ startTime: onlineClass.startTimeJSON, endTime: onlineClass.endTimeJSON })) == 0)
                return true;
            return false;
        });
    }

    getCardSlotDisplayData(onlineClass: ParsedOnlineClass) {
        const classSubject = this.vm.backendData.getClassSubjectById(onlineClass.parentClassSubject);
        const subject = this.vm.backendData.getSubjectById(classSubject.parentSubject);
        return { classSubject, subject };
    }

    isActiveTimeSpan(timeSpan: TimeSpan): boolean {
        const currentTime = this.vm.currentTime;
        const customTime = new Time({
            hour: currentTime.getHours() % 12,
            minute: currentTime.getMinutes(),
            ampm: currentTime.getHours() >= 12 ? 'pm' : 'am',
        });
        if (TimeComparator(timeSpan.startTime, customTime) == -1
            && TimeComparator(customTime, timeSpan.endTime) == -1) {
            return true;
        }
        return false;
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
        return this.getOverlappingFilteredOnlineClassList().find(onlineClass => onlineClass.day == this.vm.today && this.isActive(onlineClass));
    }

    getClassAccountInfo(onlineClass) {
        const classSubject = this.vm.backendData.getClassSubjectById(onlineClass.parentClassSubject);
        return this.vm.backendData.getAccountInfoByParentEmployee(classSubject.parentEmployee);
    }

}
